"use client";

import { useState, FormEvent } from "react";
import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";

interface APIMember {
  name: string;
  partyName?: string;
  bioguideId?: string;
  terms?: {
    item?: {
      endYear?: number;
      startYear?: number;
    }[];
  };
}

interface CongressAPIResponse {
  members?: APIMember[];
}

type Representative = {
  name: string;
  party?: string;
  memberId?: string; // from the congress API
};

export default function Home() {
  return (
    <div className="bg-white">
      <Nav />
      <Hero />
      {/* MULTI-STEP FORM SECTION */}
      <section
        id="multi-step-form"
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-48"
      >
        <MultiStepForm />
      </section>
    </div>
  );
}

function MultiStepForm() {
  const [step, setStep] = useState(1);

  // Basic constituent info (Step 1)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateAbbr, setStateAbbr] = useState(""); // e.g. "NE"
  const [zip, setZip] = useState("");

  // Reps (Step 2)
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [selectedReps, setSelectedReps] = useState<Representative[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Step 3 new fields
  const [template, setTemplate] = useState(""); // e.g. "pancan"
  const [subject, setSubject] = useState("");
  const [personalizedMessage, setPersonalizedMessage] = useState(""); // optional

  // Submission results (Step 4)
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    details: string;
  } | null>(null);

  // STEP NAVIGATION
  const handleNext = () => {
    if (step === 1) {
      // Basic validation
      if (!name || !email || !address || !city || !stateAbbr || !zip) {
        alert("Please fill out all required fields.");
        return;
      }
    }
    if (step === 2 && selectedReps.length === 0) {
      alert("Please select at least one representative to contact.");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setSubmissionStatus(null);
    setStep(step - 1);
  };

  // FETCH REPS (Step 2)
  const handleFetchReps = async () => {
    if (!stateAbbr || !zip) {
      alert("State and Zip are required to look up representatives.");
      return;
    }
    try {
      setIsFetching(true);
      const API_KEY = process.env.NEXT_PUBLIC_CONGRESS_API_KEY;
      if (!API_KEY) {
        throw new Error("API Key is missing or not set");
      }

      const url = `https://api.congress.gov/v3/member/${stateAbbr.toUpperCase()}?api_key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch representatives");
      }
      const data = (await res.json()) as CongressAPIResponse;

      // Filter out members who are no longer in office
      const currentYear = new Date().getFullYear();
      const repsInOffice = (data.members || []).filter((m: APIMember) => {
        const termItems = m?.terms?.item || [];
        // Keep if any term is ongoing
        return termItems.some((term) => {
          return !term.endYear || term.endYear >= currentYear;
        });
      });

      // Map relevant fields
      const newReps: Representative[] = repsInOffice.map((m: APIMember) => ({
        name: m.name, // e.g. "Fischer, Deb"
        party: m.partyName, // e.g. "Republican"
        memberId: m.bioguideId,
      }));

      setRepresentatives(newReps);
      setSelectedReps([]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Could not fetch reps.");
      }
    } finally {
      setIsFetching(false);
    }
  };

  // TOGGLE REP SELECT
  const handleToggleRep = (rep: Representative) => {
    const exists = selectedReps.find((r) => r.memberId === rep.memberId);
    if (exists) {
      setSelectedReps(selectedReps.filter((r) => r.memberId !== rep.memberId));
    } else {
      setSelectedReps([...selectedReps, rep]);
    }
  };

  // BUILD TEMPLATE PREVIEW
  // If the user selects "pancan," we fill in placeholders. For the preview, we’ll
  // just show the first selected rep’s name (if any) or fallback to "[Rep. Name]".
  const buildTemplatePreview = () => {
    if (template !== "pancan") return "";

    function normalizeName(invertedName: string): string {
      // if the name contains a comma, assume the format "LastName, FirstName"
      if (invertedName.includes(",")) {
        const [last, first] = invertedName.split(",").map((s) => s.trim());
        return `${first} ${last}`; // "Deb Fischer"
      }
      // otherwise, just return what we have
      return invertedName;
    }

    const repName =
      selectedReps.length > 0
        ? normalizeName(selectedReps[0].name)
        : "[Rep. Name]";
    const stateLabel = stateAbbr || "[state]";
    const userName = name || "[Your Name]";
    const customMsg = personalizedMessage || "";

    // Use const for ESLint's prefer-const rule
    const finalSubject = subject || "Pancreatic Cancer Awareness Request";

    const finalBody = `
Dear ${repName},

As a resident of ${stateLabel} and a constituent, I want to welcome you back to Congress and remind you why your support
of lifesaving pancreatic cancer research is critical.

According to both the CDC and NIH the rate of pancreatic cancer in ${stateLabel} is rising.

Pancreatic cancer is the only major cancer with a five-year survival rate below 20%. Over the last two decades,
research investments by Congress have increased the survival trend from a mere 4%. However, the ACS recently
announced that for the first time in three years, the survival rate for pancreatic cancer remains flat at just 13%.
Furthermore, pancreatic cancer remains on course to become the second leading cause of cancer death by 2030.
Due to the nature of the pancreas’s location and current testing methods, patients are often diagnosed too late.
The only way to change this is by providing predictable and robust research funding.

This is why I’m asking you to work to pass a fiscal year 2025 spending package in a bi-partisan manner that increases
funding for pancreatic cancer research by 30%.

${customMsg ? customMsg : "[Personalized message from constituent]"}

More than 80% of Pancreatic cancer research funding comes from the federal government. I ask for your support on behalf of everyone fighting pancreatic cancer today and those who will face it in the future.

Thank you for your consideration.

${userName}
`.trim();

    return `Subject: ${finalSubject}\n\n${finalBody}`;
  };

  // SUBMIT MESSAGE (Step 3 -> Step 4)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedReps.length) {
      alert("No representatives selected.");
      return;
    }

    try {
      // Build the final message from the template (if any):
      /*      let finalMessage = "";
      if (template === "pancan") {
        finalMessage = buildTemplatePreview();
      } else {
        finalMessage = `Subject: ${subject}\n\n${personalizedMessage}`;
      }*/

      // Removed unused submissionPayload to fix ESLint no-unused-vars
      /*
      const submissionPayload = {
        name,
        email,
        address,
        city,
        state: stateAbbr,
        zip,
        chosenTemplate: template,
        finalSubject: subject,
        personalizedMessage,
        finalMessage,
        representatives: selectedReps,
      };
      */

      // Example: call your endpoint
      // const resp = await fetch("/api/submit", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(submissionPayload),
      // });
      // if (!resp.ok) throw new Error("Submission failed");

      setSubmissionStatus({
        success: true,
        details: `Successfully submitted message to ${selectedReps.length} representative(s).`,
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      setSubmissionStatus({
        success: false,
        details:
          "Something went wrong while submitting. Please try again later.",
      });
    }
  };

  // RENDER
  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
      {/* STEP INDICATORS */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span
            className={`mr-2 font-semibold ${
              step >= 1 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            Step 1
          </span>
          <span
            className={`mr-2 font-semibold ${
              step >= 2 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            Step 2
          </span>
          <span
            className={`mr-2 font-semibold ${
              step >= 3 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            Step 3
          </span>
          <span
            className={`mr-2 font-semibold ${
              step >= 4 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            Complete
          </span>
        </div>
        <div className="text-sm text-gray-500">Multi-part Form</div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <p className="text-base text-gray-600">
            Please provide your contact information below.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name*
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address*
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State (abbr)*
              </label>
              <input
                type="text"
                maxLength={2}
                placeholder="NE"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={stateAbbr}
                onChange={(e) => setStateAbbr(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip*
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleNext}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Next
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <p className="text-base text-gray-600">
            We’ll look up your representatives by State and Zip. Click “Fetch
            Reps” if you haven’t already. Then pick who you want to contact.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFetchReps}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              disabled={isFetching}
            >
              {isFetching ? "Fetching..." : "Fetch Reps"}
            </button>
            {representatives.length > 0 && (
              <span className="text-sm text-gray-500">
                Found {representatives.length} rep(s)
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {representatives.map((rep) => {
              const isSelected = !!selectedReps.find(
                (r) => r.memberId === rep.memberId,
              );
              return (
                <label
                  key={rep.memberId}
                  className={`flex cursor-pointer items-center rounded border p-2 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-indigo-600"
                    checked={isSelected}
                    onChange={() => handleToggleRep(rep)}
                  />
                  <span className="text-sm text-gray-800">
                    {rep.name}
                    {rep.party ? ` (${rep.party})` : ""}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleBack}
              className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-base text-gray-600">
            Compose your message below. Optionally select a message template and
            add a personal note.
          </p>

          {/* Message Template Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message Template
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
                if (e.target.value === "pancan") {
                  setSubject("Pancreatic Cancer Awareness Request");
                } else {
                  setSubject("");
                }
              }}
            >
              <option value="">-- Select a template --</option>
              <option value="pancan">Pancreatic Cancer Awareness</option>
            </select>
          </div>

          {/* Subject (may be dynamically set by the template) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Optional subject override"
            />
          </div>

          {/* Personalized Message (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Personalized Message (Optional)
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={personalizedMessage}
              onChange={(e) => setPersonalizedMessage(e.target.value)}
              placeholder="Add your personal story or reason here..."
            />
          </div>

          {/* Live Message Preview (only if user picked "pancan") */}
          {template === "pancan" && (
            <div>
              <h4 className="my-2 text-sm font-semibold text-gray-700">
                Message Preview
              </h4>
              <pre className="max-h-96 overflow-auto rounded-md border border-gray-300 bg-white p-4 text-sm whitespace-pre-wrap">
                {buildTemplatePreview()}
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-6">
          {submissionStatus?.success ? (
            <div className="rounded-md bg-green-50 p-4 text-green-700">
              <p className="font-semibold">Success!</p>
              <p>{submissionStatus.details}</p>
            </div>
          ) : (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Error</p>
              <p>{submissionStatus?.details}</p>
            </div>
          )}
          <button
            onClick={() => {
              // Reset everything if they want to do another submission
              setStep(1);
              setSubmissionStatus(null);
              setName("");
              setEmail("");
              setAddress("");
              setCity("");
              setStateAbbr("");
              setZip("");
              setRepresentatives([]);
              setSelectedReps([]);
              setTemplate("");
              setSubject("");
              setPersonalizedMessage("");
            }}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
