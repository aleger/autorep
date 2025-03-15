"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "About Me", href: "#" },
  { name: "Contact", href: "#" },
];

type Representative = {
  name: string;
  party?: string;
  memberId?: string; // from the congress API
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* HEADER & NAV */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-semibold">AutoRep</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
        </nav>

        {/* MOBILE MENU (DIALOG) */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">AutoRep</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6"></div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* HERO / INTRO SECTION */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem]
                       -translate-x-1/2 rotate-[30deg] bg-linear-to-tr
                       from-[#ff80b5] to-[#9089fc] opacity-30
                       sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl pt-32 pb-12">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Created for college research purposes only.{" "}
              <a href="#" className="font-semibold text-indigo-600">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1
              className="text-5xl font-semibold tracking-tight text-balance
                         text-gray-900 sm:text-7xl"
            >
              Democracy flourishes with your voice
            </h1>
            <p
              className="mt-8 text-lg font-medium text-pretty text-gray-500
                         sm:text-xl/8"
            >
              AutoRep uses publicly available data to connect you with your
              representatives in Congress quickly and with minimal effort.
            </p>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678
                       w-[36.125rem] -translate-x-1/2 bg-linear-to-tr
                       from-[#ff80b5] to-[#9089fc] opacity-30
                       sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

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

  // Basic constituent info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateAbbr, setStateAbbr] = useState(""); // e.g. "NE"
  const [zip, setZip] = useState("");

  // Reps
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [selectedReps, setSelectedReps] = useState<Representative[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Message
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Submission results
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    details: string;
  } | null>(null);

  // Go to next step
  const handleNext = () => {
    // Basic validation for step 1
    if (step === 1) {
      if (!name || !email || !address || !city || !stateAbbr || !zip) {
        alert("Please fill out all required fields.");
        return;
      }
    }
    // Check for at least one rep in step 2
    if (step === 2 && selectedReps.length === 0) {
      alert("Please select at least one representative to contact.");
      return;
    }
    setStep(step + 1);
  };

  // Go to previous step
  const handleBack = () => {
    setSubmissionStatus(null);
    setStep(step - 1);
  };

  // Fetch reps by state & zip
  const handleFetchReps = async () => {
    if (!stateAbbr || !zip) {
      alert("State and Zip are required to look up representatives.");
      return;
    }
    try {
      setIsFetching(true);
      // You must add your own KEY & check docs to confirm endpoint shape
      // For example: https://api.congress.gov/v3/member?state=NE&limit=10&api_key=YOUR_KEY
      const API_KEY = "YOUR_API_KEY_HERE"; // <-- Replace me
      const url = `https://api.congress.gov/v3/member?state=${stateAbbr.toUpperCase()}&limit=20&api_key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch representatives");
      }
      const data = await res.json();
      // This shape will vary; adapt based on actual JSON structure
      const newReps: Representative[] = (data?.members || []).map((m: any) => ({
        name: m.first_name + " " + m.last_name,
        party: m.party,
        memberId: m.identifiers?.[0]?.id || "",
      }));
      setRepresentatives(newReps);
      setSelectedReps([]);
    } catch (error: any) {
      alert(error.message || "Could not fetch reps.");
    } finally {
      setIsFetching(false);
    }
  };

  // Toggle a rep on/off
  const handleToggleRep = (rep: Representative) => {
    const exists = selectedReps.find((r) => r.memberId === rep.memberId);
    if (exists) {
      setSelectedReps(selectedReps.filter((r) => r.memberId !== rep.memberId));
    } else {
      setSelectedReps([...selectedReps, rep]);
    }
  };

  // Submit message
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !message || selectedReps.length === 0) {
      alert("Subject, message, and representative choice are required.");
      return;
    }

    try {
      // In a real app, you might loop over each selected rep
      // and do a separate fetch or API call. We'll do a single
      // example submission here. Replace with your own logic.
      const submissionPayload = {
        name,
        email,
        address,
        city,
        state: stateAbbr,
        zip,
        subject,
        message,
        representatives: selectedReps,
      };
      // Example call to your own route or external API:
      // const resp = await fetch("/api/submit", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(submissionPayload),
      // });

      // For the demo, let's just show success:
      setSubmissionStatus({
        success: true,
        details: `Successfully submitted message to ${selectedReps.length} representative(s).`,
      });

      // Move to final step
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

  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
      {/* Step Indicators */}
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
            Step 4
          </span>
        </div>
        <div className="text-sm text-gray-500">Multi-part Form</div>
      </div>

      {/* Render step */}
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
                className="mt-1 w-full rounded-md border border-gray-300
                           px-3 py-2 text-sm shadow-sm focus:outline-none
                           focus:ring-2 focus:ring-indigo-600"
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
                className="mt-1 w-full rounded-md border border-gray-300
                           px-3 py-2 text-sm shadow-sm focus:outline-none
                           focus:ring-2 focus:ring-indigo-600"
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
              className="mt-1 w-full rounded-md border border-gray-300
                         px-3 py-2 text-sm shadow-sm focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
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
                className="mt-1 w-full rounded-md border border-gray-300
                           px-3 py-2 text-sm shadow-sm focus:outline-none
                           focus:ring-2 focus:ring-indigo-600"
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
                className="mt-1 w-full rounded-md border border-gray-300
                           px-3 py-2 text-sm uppercase shadow-sm
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-600"
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
                className="mt-1 w-full rounded-md border border-gray-300
                           px-3 py-2 text-sm shadow-sm focus:outline-none
                           focus:ring-2 focus:ring-indigo-600"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleNext}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm
                       font-semibold text-white shadow-sm
                       hover:bg-indigo-500 focus:outline-none
                       focus:ring-2 focus:ring-indigo-600"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <p className="text-base text-gray-600">
            We’ll look up your representatives by State and Zip. Click “Fetch
            Reps” if you haven’t already. Then pick who you want to contact.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFetchReps}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm
                         font-semibold text-white shadow-sm
                         hover:bg-indigo-500 focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
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
                  className={`flex cursor-pointer items-center rounded border
                              p-2 ${
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
              className="rounded-md bg-gray-300 px-3 py-2 text-sm
                         font-semibold text-gray-700 shadow-sm
                         hover:bg-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm
                         font-semibold text-white shadow-sm
                         hover:bg-indigo-500 focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-base text-gray-600">
            Compose your message below. We will submit one form per
            representative selected.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject*
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300
                         px-3 py-2 text-sm shadow-sm focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message*
            </label>
            <textarea
              rows={6}
              className="mt-1 w-full rounded-md border border-gray-300
                         px-3 py-2 text-sm shadow-sm focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md bg-gray-300 px-3 py-2 text-sm
                         font-semibold text-gray-700 shadow-sm
                         hover:bg-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm
                         font-semibold text-white shadow-sm
                         hover:bg-indigo-500 focus:outline-none
                         focus:ring-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      )}

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
              setSubject("");
              setMessage("");
            }}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm
                       font-semibold text-white shadow-sm
                       hover:bg-indigo-500 focus:outline-none
                       focus:ring-2 focus:ring-indigo-600"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
