"use client";

import { useState, FormEvent } from "react";
import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
];

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
  memberId?: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  stateAbbr?: string;
  zip?: string;
};

const STEPS = [
  { number: 1, label: "Your Info" },
  { number: 2, label: "Your Reps" },
  { number: 3, label: "Message" },
  { number: 4, label: "Complete" },
];

function normalizeName(invertedName: string): string {
  if (invertedName.includes(",")) {
    const [last, first] = invertedName.split(",").map((s) => s.trim());
    return `${first} ${last}`;
  }
  return invertedName;
}

export default function Home() {
  return (
    <div className="bg-white">
      <Nav />
      <Hero />
      <section
        id="multi-step-form"
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-48"
      >
        <MultiStepForm />
      </section>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  currentStep > s.number
                    ? "bg-indigo-600 text-white"
                    : currentStep === s.number
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > s.number ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  currentStep >= s.number ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 mb-5">
                <div
                  className={`h-full transition-colors ${
                    currentStep > s.number ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiStepForm() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateAbbr, setStateAbbr] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [selectedReps, setSelectedReps] = useState<Representative[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [personalizedMessage, setPersonalizedMessage] = useState("");

  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    details: string;
  } | null>(null);

  // Validation
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!stateAbbr) newErrors.stateAbbr = "State is required.";
    if (!zip.trim()) {
      newErrors.zip = "Zip is required.";
    } else if (!/^\d{5}(-\d{4})?$/.test(zip)) {
      newErrors.zip = "Enter a valid 5-digit zip code.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && selectedReps.length === 0) {
      setFetchError("Select at least one representative to continue.");
      return;
    }
    setFetchError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setSubmissionStatus(null);
    setFetchError("");
    setStep(step - 1);
  };

  const handleFetchReps = async () => {
    if (!stateAbbr || !zip) {
      setFetchError("State and Zip are required to look up representatives.");
      return;
    }
    try {
      setIsFetching(true);
      setFetchError("");
      const res = await fetch(`/api/reps?state=${stateAbbr.toUpperCase()}`);
      const payload = (await res.json()) as unknown;

      if (!res.ok) {
        const errorMessage =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Failed to fetch representatives. Try again.";
        throw new Error(errorMessage);
      }

      const data = payload as CongressAPIResponse;

      const currentYear = new Date().getFullYear();
      const repsInOffice = (data.members || []).filter((m: APIMember) => {
        const termItems = m?.terms?.item || [];
        return termItems.some((term) => !term.endYear || term.endYear >= currentYear);
      });

      const newReps: Representative[] = repsInOffice.map((m: APIMember) => ({
        name: m.name,
        party: m.partyName,
        memberId: m.bioguideId,
      }));

      if (newReps.length === 0) {
        setFetchError("No active representatives found for this state.");
      }

      setRepresentatives(newReps);
      setSelectedReps([]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("Could not fetch representatives.");
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleToggleRep = (rep: Representative) => {
    const exists = selectedReps.find((r) => r.memberId === rep.memberId);
    if (exists) {
      setSelectedReps(selectedReps.filter((r) => r.memberId !== rep.memberId));
    } else {
      setSelectedReps([...selectedReps, rep]);
    }
    setFetchError("");
  };

  const buildTemplatePreview = () => {
    const repName =
      selectedReps.length > 0
        ? normalizeName(selectedReps[0].name)
        : "[Rep. Name]";
    const stateLabel = stateAbbr || "[state]";
    const userName = name || "[Your Name]";
    const customMsg = personalizedMessage || "[Personalized message from constituent]";

    if (template === "pancan") {
      const finalSubject = subject || "Pancreatic Cancer Awareness Request";
      const finalBody = `Dear ${repName},

As a resident of ${stateLabel} and a constituent, I want to welcome you back to Congress and remind you why your support of lifesaving pancreatic cancer research is critical.

According to both the CDC and NIH the rate of pancreatic cancer in ${stateLabel} is rising.

Pancreatic cancer is the only major cancer with a five-year survival rate below 20%. Over the last two decades, research investments by Congress have increased the survival trend from a mere 4%. However, the ACS recently announced that for the first time in three years, the survival rate for pancreatic cancer remains flat at just 13%. Furthermore, pancreatic cancer remains on course to become the second leading cause of cancer death by 2030. Due to the nature of the pancreas's location and current testing methods, patients are often diagnosed too late. The only way to change this is by providing predictable and robust research funding.

This is why I'm asking you to work to pass a fiscal year 2025 spending package in a bi-partisan manner that increases funding for pancreatic cancer research by 30%.

${customMsg}

More than 80% of Pancreatic cancer research funding comes from the federal government. I ask for your support on behalf of everyone fighting pancreatic cancer today and those who will face it in the future.

Thank you for your consideration.

${userName}`;

      return `Subject: ${finalSubject}\n\n${finalBody}`;
    }

    if (template === "native-education") {
      const finalSubject = subject || "The Issue of Native American Education";
      const finalBody = `Dear ${repName},

As a resident of ${stateLabel} and a constituent, I want to tell you about an issue that has come to my attention.

According to the National Center for Education Statistics, the total college enrollment rate for Native American students was just 24%. This is the lowest among all racial and ethnic groups.

As you know, Native Americans have overcome many historical hurdles when it comes to obtaining education. Such strong and resilient people deserve the same access to education as everyone else.

This is part of a larger systemic issue spanning across this country's history, and changes need to be made on multiple fronts. In 2023, Colorado Public Radio reported that there is a difference of $8,814 in per-pupil funding between tribal and off-reservation schools. Similarly, native women only earn 58.3 cents compared to a white man's dollar, according to the Institute for Women's Policy Research.

These barriers affect native students, native leaders, native communities, and everyone else. It is important to me that Native Americans receive representation, equity, and access. The first people living in our country should not be the last ones thought of.

I cannot stress enough how important supporting native citizens throughout their lives and not just at the collegiate level is. Government plays a crucial role in opening the doors to higher education.

${customMsg}

Government plays a crucial role in opening the doors to higher education. Last year, the Trump administration increased investment in a one-time allocation for Tribal Colleges and Universities.

But long-lasting problems deserve foundational solutions. I ask for your support on behalf of everyone affected today and those who will face this problem in the future.

I'm informing you of this problem as I want to see it improved, whether that be at the national level or within our local government.

Thank you for your consideration.

${userName}`;

      return `Subject: ${finalSubject}\n\n${finalBody}`;
    }

    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedReps.length) {
      setFetchError("No representatives selected.");
      return;
    }

    try {
      let finalMessage = "";
      if (template === "pancan" || template === "native-education") {
        finalMessage = buildTemplatePreview();
      } else {
        finalMessage = `Subject: ${subject}\n\n${personalizedMessage}`;
      }

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

      // TODO: POST to /api/submit when backend is ready
      console.log("Submission payload:", submissionPayload);

      setSubmissionStatus({
        success: true,
        details: `Successfully submitted message to ${selectedReps.length} representative(s).`,
      });
      setStep(4);
    } catch (err) {
      console.error(err);
      setSubmissionStatus({
        success: false,
        details: "Something went wrong while submitting. Please try again later.",
      });
    }
  };

  const resetForm = () => {
    setStep(1);
    setSubmissionStatus(null);
    setName("");
    setEmail("");
    setAddress("");
    setCity("");
    setStateAbbr("");
    setZip("");
    setErrors({});
    setRepresentatives([]);
    setSelectedReps([]);
    setTemplate("");
    setSubject("");
    setPersonalizedMessage("");
    setFetchError("");
  };

  const inputClass = (hasError: boolean) =>
    `mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="rounded-xl bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200">
      <StepIndicator currentStep={step} />

      {/* STEP 1: Contact Info */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-base text-gray-600">
            Enter your contact information to get started.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className={inputClass(!!errors.name)}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className={inputClass(!!errors.email)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              className={inputClass(!!errors.address)}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              placeholder="123 Main St"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                className={inputClass(!!errors.city)}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
                placeholder="Omaha"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                className={inputClass(!!errors.stateAbbr)}
                value={stateAbbr}
                onChange={(e) => {
                  setStateAbbr(e.target.value);
                  if (errors.stateAbbr)
                    setErrors({ ...errors, stateAbbr: undefined });
                }}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.stateAbbr && (
                <p className="mt-1 text-xs text-red-600">{errors.stateAbbr}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip
              </label>
              <input
                type="text"
                className={inputClass(!!errors.zip)}
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  if (errors.zip) setErrors({ ...errors, zip: undefined });
                }}
                placeholder="68101"
                maxLength={10}
              />
              {errors.zip && (
                <p className="mt-1 text-xs text-red-600">{errors.zip}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Reps */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-base text-gray-600">
            Fetch your representatives, then select who you want to contact.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFetchReps}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 transition-colors"
              disabled={isFetching}
            >
              {isFetching ? "Fetching..." : "Fetch Reps"}
            </button>
            {representatives.length > 0 && (
              <span className="text-sm text-gray-500">
                Found {representatives.length} representative(s)
              </span>
            )}
          </div>

          {fetchError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {fetchError}
            </div>
          )}

          {representatives.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {representatives.map((rep) => {
                const isSelected = !!selectedReps.find(
                  (r) => r.memberId === rep.memberId,
                );
                return (
                  <label
                    key={rep.memberId}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 accent-indigo-600"
                      checked={isSelected}
                      onChange={() => handleToggleRep(rep)}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">
                        {normalizeName(rep.name)}
                      </span>
                      {rep.party && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({rep.party})
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleBack}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Compose Message */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-base text-gray-600">
            Select a message template or write your own. Add a personal note if
            you want.
          </p>

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
                } else if (e.target.value === "native-education") {
                  setSubject("The Issue of Native American Education");
                } else {
                  setSubject("");
                }
              }}
            >
              <option value="">-- No template (write your own) --</option>
              <option value="pancan">Pancreatic Cancer Awareness</option>
              <option value="native-education">
                Native American Education
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line for your message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Personal Message (Optional)
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={personalizedMessage}
              onChange={(e) => setPersonalizedMessage(e.target.value)}
              placeholder="Add your personal story or reason here..."
            />
          </div>

          {(template === "pancan" || template === "native-education") && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">
                Message Preview
              </h4>
              <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {buildTemplatePreview()}
              </pre>
            </div>
          )}

          {fetchError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {fetchError}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-6">
          {submissionStatus?.success ? (
            <div className="rounded-lg bg-green-50 p-5 ring-1 ring-green-200">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-semibold text-green-800">Success</p>
              </div>
              <p className="text-sm text-green-700">
                {submissionStatus.details}
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-5 ring-1 ring-red-200">
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">
                {submissionStatus?.details}
              </p>
            </div>
          )}
          <button
            onClick={resetForm}
            className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
