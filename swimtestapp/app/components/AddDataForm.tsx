import { useState } from "react";
import { SwimTestData } from "../page";

export default function AddDataForm({
  onAdd,
  data,
}: {
  onAdd: (data: SwimTestData) => void;
  data: SwimTestData[];
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bandColor, setBandColor] = useState("");
  const [tester, setTester] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (submitDisabled) return;
    setSubmitDisabled(true);
    e.preventDefault();
    const testDate = new Date().toLocaleDateString("en-US");

    // Sanitize input
    const sanitizedFirstName = firstName.replace(/[^a-zA-Z'-]/g, "").trim();
    const sanitizedLastName = lastName.replace(/[^a-zA-Z'-]/g, "").trim();
    setFirstName(sanitizedFirstName);
    setLastName(sanitizedLastName);

    const sanitizedTester = tester.replace(/[^a-zA-Z '-]/g, "").trim();
    const sanitizedTesterNoSpace = tester.replace(/\s/g, "");

    // Validate input
    if (sanitizedFirstName.length < 2 || sanitizedFirstName.length > 20) {
      alert("ERROR! First name must be between 2 and 25 characters.");
      setSubmitDisabled(false);
      return;
    }
    if (sanitizedLastName.length < 2 || sanitizedLastName.length > 20) {
      alert("ERROR! Last name must be between 2 and 20 characters.");
      setSubmitDisabled(false);
      return;
    }
    if (sanitizedTesterNoSpace.length < 3 || sanitizedTester.length > 38) {
      alert(
        "ERROR! Tester name must be between 3 and 38 characters. Please enter the full name of the lifeguard tester."
      );
      setSubmitDisabled(false);
      return;
    }

    // Ensure tester name is a full first and last name
    const testerNameParts = sanitizedTester.split(/\s+/);
    const finalTester = testerNameParts
      .map((part, index) => {
        if (index === 0 && part.length === 2 && part === part.toUpperCase()) {
          return part;
        }
        return part
          .split(/[-']/)
          .map((subPart, subIndex) => {
            if (
              subIndex === 0 &&
              subPart.length === 2 &&
              subPart === subPart.toUpperCase()
            ) {
              return subPart;
            }
            return (
              subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase()
            );
          })
          .join(part.includes("-") ? "-" : "'");
      })
      .join(" ");
    setTester(finalTester);
    if (testerNameParts.length < 2) {
      alert("ERROR! Tester name must include both a first and last name.");
      setSubmitDisabled(false);
      return;
    }
    if (testerNameParts.some((part) => part.length < 2)) {
      alert(
        "ERROR! Each part of the tester name must have at least 2 characters."
      );
      setSubmitDisabled(false);
      return;
    }
    if (
      testerNameParts.some(
        (part) =>
          part.toLowerCase().includes("lifeguard") ||
          part.toLowerCase() === "guard" ||
          part.toLowerCase() === "staff" ||
          part.toLowerCase() === "tester"
      )
    ) {
      alert(
        'ERROR! Tester name cannot include words like "guard," "tester," or "staff." Please provide the full name.'
      );
      setSubmitDisabled(false);
      return;
    }

    // Check if swimmer already exists
    const fullName = `${sanitizedFirstName}${sanitizedLastName}`
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase();
    const existingSwimmer = data.find((item) => item.fullName === fullName);
    if (existingSwimmer) {
      alert(
        `ERROR! Swimmer ${existingSwimmer.firstName.toUpperCase()} ${existingSwimmer.lastName.toUpperCase()} already exists as a ${existingSwimmer.bandColor.toUpperCase()} band. Tested by ${existingSwimmer.tester.toUpperCase()} on Date ${existingSwimmer.testDate.toUpperCase()}.`
      );
      setSubmitDisabled(false);
      return;
    }
    // Create new swimmer object
    const swimTestData: SwimTestData = {
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      bandColor,
      tester: finalTester,
      testDate,
      fullName,
    };

    // Add swimmer to database
    try {
      const response = await fetch("/api/swimtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(swimTestData),
      });
      if (response.ok) {
        onAdd(swimTestData);
        alert(
          `Success! Swimmer ${sanitizedFirstName.toUpperCase()} ${sanitizedLastName.toUpperCase()} was added as a ${bandColor.toUpperCase()} band.`
        );
        setSubmitDisabled(false);
        setFirstName("");
        setLastName("");
      } else {
        console.error(response);
        alert(
          `Error adding swimmer: Server error. ${response.status} ${response.statusText} `
        );
        setSubmitDisabled(false);
      }
    } catch (error) {
      console.error(error);
      alert(`Error adding swimmer: ${error}`);
      setSubmitDisabled(false);
    }
    setSubmitDisabled(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block font-bold">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Sam"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block font-bold">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Safetly"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="relative">
        <label htmlFor="bandColor" className="block font-bold">
          Band Color
        </label>
        <select
          id="bandColor"
          value={bandColor}
          onChange={(e) => setBandColor(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded appearance-none ${
            bandColor === "g"
              ? "bg-green-100 text-green-800"
              : bandColor === "y"
              ? "bg-yellow-100 text-yellow-800"
              : bandColor === "r"
              ? "bg-red-100 text-red-800"
              : "bg-white"
          }`}
        >
          <option value="" disabled>
            Select Band Color
          </option>
          <option value="g">🟢 Green</option>
          <option value="y">🟡 Yellow</option>
          <option value="r">🔴 Red</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>
      <div>
        <label htmlFor="tester" className="block font-bold">
          Lifeguard Tester
        </label>
        <input
          id="tester"
          type="text"
          value={tester}
          onChange={(e) => setTester(e.target.value)}
          placeholder="Commodore Longfellow"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="submit"
        className={`px-4 py-2 rounded ${
          submitDisabled
            ? "bg-gray-400 text-gray-800 cursor-not-allowed"
            : "bg-blue-500 text-white hover:opacity-80"
        }`}
        disabled={submitDisabled}
      >
        {submitDisabled ? "Submitting..." : "Add Swimmer"}
      </button>
    </form>
  );
}
