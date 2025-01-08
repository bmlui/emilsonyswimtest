import { useState } from 'react';
import { SwimTestData } from '../page';


export default function AddDataForm({ onAdd, data }: { onAdd: (data: SwimTestData) => void; data: SwimTestData[] }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bandColor, setBandColor] = useState('');
  const [tester, setTester] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const testDate = new Date().toLocaleDateString('en-US');

    // Sanitize input
    const sanitizedFirstName = firstName.replace(/[^a-zA-Z'-]/g, '').trim();
    const sanitizedLastName = lastName.replace(/[^a-zA-Z'-]/g, '').trim();
    const sanitizedTester = tester.replace(/[^a-zA-Z '-]/g, '').trim();
    setFirstName(sanitizedFirstName);
    setLastName(sanitizedLastName);
    setTester(sanitizedTester);
    const sanitizedTesterNoSpace = tester.replace(/\s/g, '');
// Validate input
    if (sanitizedFirstName.length < 2 || sanitizedFirstName.length > 25) {
      alert('ERROR! First name must be between 2 and 25 characters.');
      return;
    }
    if (sanitizedLastName.length < 2 || sanitizedLastName.length > 25) {
      alert('ERROR! Last name must be between 2 and 25 characters.');
      return;
    }
    if (sanitizedTesterNoSpace.length < 2 || sanitizedTester.length > 50) {
      alert('ERROR! Tester name must be between 2 and 50 characters.');
      return;
    }
    // Check if swimmer already exists
    const fullName = `${sanitizedFirstName}${sanitizedLastName}`.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const existingSwimmer = data.find((item) => item.fullName === fullName);
    if (existingSwimmer) {
        alert(`ERROR! Swimmer ${existingSwimmer.firstName.toUpperCase()} ${existingSwimmer.lastName.toUpperCase()} already exists as a ${existingSwimmer.bandColor.toUpperCase()} band. Tested by ${existingSwimmer.tester.toUpperCase()} on Date ${existingSwimmer.testDate.toUpperCase()}.`);
        return;
      }
      // Create new swimmer object
    const swimTestData: SwimTestData = {
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      bandColor,
      tester: sanitizedTester,
      testDate,
      fullName,
    };
    // Add swimmer to database
try {
    const response = await fetch('/api/swimtest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swimTestData),
    });

    if (response.ok) {
      onAdd(swimTestData);
      alert(`Success! Swimmer ${sanitizedFirstName.toUpperCase()} ${sanitizedLastName.toUpperCase()} was added as a ${bandColor.toUpperCase()} band.`);
      setFirstName('');
      setLastName('');
    } else {
      console.error(response);
      alert(`Server error. Failed to add swimmer: ${response.statusText}`);
    }

  } catch (error) {
    console.error(error);
    alert(`Error adding swimmer: ${error}`);
  }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block font-bold">First Name</label>
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
        <label htmlFor="lastName" className="block font-bold">Last Name</label>
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
        <label htmlFor="bandColor" className="block font-bold">Band Color</label>
        <select
          id="bandColor"
          value={bandColor}
          onChange={(e) => setBandColor(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded appearance-none ${
            bandColor === 'g' ? 'bg-green-100 text-green-800' :
            bandColor === 'y' ? 'bg-yellow-100 text-yellow-800' :
            bandColor === 'r' ? 'bg-red-100 text-red-800' : 'bg-white'
          }`}
        >
          <option value="" disabled>Select Band Color</option>
          <option value="g">🟢 Green</option>
          <option value="y">🟡 Yellow</option>
          <option value="r">🔴 Red</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </div>
      </div>
      <div>
        <label htmlFor="tester" className="block font-bold">Lifeguard Tester</label>
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
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-80">
        Add Swimmer
      </button>
    </form>
  );
}