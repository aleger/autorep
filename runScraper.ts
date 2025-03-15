import { Prisma, PrismaClient } from "@prisma/client";
import { AnyNode } from "domhandler";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { addExtra } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";

const prisma = new PrismaClient();
const twoCaptchaApiKey = process.env.TWO_CAPTCHA_API_KEY || "missing key";

/**
 * Returns a PuppeteerExtra instance with Stealth and Recaptcha plugins.
 */
function getPuppeteerExtra() {
  const puppeteerExtra = addExtra(puppeteer);
  puppeteerExtra.use(
    RecaptchaPlugin({
      provider: { id: "2captcha", token: twoCaptchaApiKey },
      visualFeedback: true,
    }),
  );
  puppeteerExtra.use(StealthPlugin());
  return puppeteerExtra;
}

async function scrapeForm(url: string, bioguide_id: string) {
  console.log(`Scraping ${url}`);
  const puppeteerExtra = getPuppeteerExtra();
  const browser = await puppeteerExtra.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle0" });

    // Solve captchas if present
    await page.solveRecaptchas();

    // Optional extra delay for dynamic content
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get all <form> elements on the page
    const forms = await page.$$("form");
    if (forms.length === 0) {
      console.log(`No forms found on ${url}`);
      return;
    }

    // Keywords for identifying fields
    const firstNameKeywords = ["first", "given"];
    const lastNameKeywords = ["last", "surname", "family"];
    const topicKeywords = ["topic", "subject", "category", "issue"];
    const nameKeywords = ["name", "full name"];

    // Helper: get label text for an input (via ID or parent/previous label)
    function getLabelText(
      input: cheerio.Cheerio<AnyNode>,
      $: cheerio.CheerioAPI,
    ): string {
      const id = input.attr("id");
      if (id) {
        const label = $(`label[for="${id}"]`);
        if (label.length > 0) return label.text().trim();
      }
      const parentLabel = input.parent("label");
      if (parentLabel.length > 0) {
        return parentLabel.text().trim();
      }
      const prevLabel = input.prev("label");
      if (prevLabel.length > 0) {
        return prevLabel.text().trim();
      }
      return "";
    }

    let bestScore = -1;
    let bestFormConfig: {
      inputs: {
        type: string;
        name: string | undefined;
        placeholder: string | undefined;
        label: string;
        options?: { value: string; text: string }[];
      }[];
      isMultipart: boolean;
    } | null = null;

    // Evaluate each form on the page
    for (const form of forms) {
      // Grab raw HTML of the form
      const formHtml = await form.evaluate((f) => f.outerHTML);
      const $ = cheerio.load(formHtml);

      // We'll collect info about each named input/textarea/select
      const inputs: {
        type: string;
        name: string | undefined;
        placeholder: string | undefined;
        label: string;
        text: string;
        options?: { value: string; text: string }[];
      }[] = [];

      // For each element with a [name] attribute
      $("[name]", "form").each((i, elem) => {
        const $elem = $(elem);
        const tagName = $elem.prop("tagName")!.toLowerCase();

        let type: string;
        let options: { value: string; text: string }[] | undefined;

        // Distinguish between input/select/textarea
        if (tagName === "select") {
          type = "select";
          // Capture the options for this select
          options = [];
          $elem.find("option").each((j, optionElem) => {
            const $option = $(optionElem);
            const optionValue = $option.attr("value") ?? $option.text();
            const optionText = $option.text().trim();
            // Store them in the array
            options!.push({ value: optionValue, text: optionText });
          });
        } else if (tagName === "textarea") {
          type = "textarea";
        } else if (tagName === "input") {
          type = $elem.attr("type") || "text";
        } else {
          type = "unknown";
        }

        const name = $elem.attr("name");
        const placeholder = $elem.attr("placeholder") || "";
        const label = getLabelText($elem, $);

        // For scoring: combine label + placeholder, then lowercase
        const text = (label + " " + placeholder).trim().toLowerCase();

        inputs.push({ type, name, placeholder, label, text, options });
      });

      // Score the form based on presence of keywords
      const visibleInputs = inputs.filter((inp) => inp.type !== "hidden");
      const hasFirst = visibleInputs.some((inp) =>
        firstNameKeywords.some((k) => inp.text.includes(k)),
      );
      const hasLast = visibleInputs.some((inp) =>
        lastNameKeywords.some((k) => inp.text.includes(k)),
      );
      const hasTopic = visibleInputs.some((inp) =>
        topicKeywords.some((k) => inp.text.includes(k)),
      );
      const hasName = visibleInputs.some((inp) =>
        nameKeywords.some((k) => inp.text.includes(k)),
      );

      let score = 0;
      if (hasFirst && hasLast && hasTopic) {
        score = 3; // best scenario
      } else if (hasName && hasTopic) {
        score = 2; // next best
      }

      // If this form is the highest-scoring so far, store its details
      if (score > bestScore) {
        bestScore = score;
        const isMultipart = $("form").attr("enctype") === "multipart/form-data";
        // Re-map inputs so we only store the relevant fields (plus options)
        const inputsConfig = inputs.map((inp) => ({
          type: inp.type,
          name: inp.name,
          placeholder: inp.placeholder,
          label: inp.label,
          // For a select, we carry over the "options" array
          ...(inp.options ? { options: inp.options } : {}),
        }));
        bestFormConfig = { inputs: inputsConfig, isMultipart };
      }
    }

    // If we found a form that had some positive score, update DB
    if (bestFormConfig) {
      await prisma.congressForm.update({
        where: { bioguide_id },
        data: { form_configuration: bestFormConfig },
      });
      console.log(`Saved best form for ${url} with score: ${bestScore}`);
    } else {
      console.log(
        `No suitable form found on ${url} (bestScore = ${bestScore}).`,
      );
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  } finally {
    await browser.close();
  }
}

async function main() {
  // Example: fetch all records with NULL form_configuration
  const formsToScrape = await prisma.congressForm.findMany({
    where: { form_configuration: { equals: Prisma.DbNull } },
  });

  for (const form of formsToScrape) {
    await scrapeForm(form.url, form.bioguide_id);
    // Slight delay to be polite
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

main()
  .then(() => console.log("Scraping completed"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
