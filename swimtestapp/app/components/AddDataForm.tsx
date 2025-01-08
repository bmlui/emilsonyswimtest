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
    const fullName = `${firstName} ${lastName}`.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const existingSwimmer = data.find((item) => item.fullName === fullName);
    if (existingSwimmer) {
        alert(`ERROR! Swimmer ${firstName.toUpperCase()} ${lastName.toUpperCase()} already exists with band color ${existingSwimmer.bandColor.toUpperCase()}. Tested by ${existingSwimmer.tester.toUpperCase()} on Date ${existingSwimmer.testDate.toUpperCase()}.`);
        return;
      }
      
    const swimTestData: SwimTestData = {
      firstName,
      lastName,
      bandColor,
      tester,
      testDate,
      fullName,
    };
try {
    const response = await fetch('/api/swimtest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swimTestData),
    });

    if (response.ok) {
      onAdd(swimTestData);
      alert(`Success! Swimmer ${firstName.toUpperCase()} ${lastName.toUpperCase()} added as ${bandColor.toUpperCase()} band. Tested by ${tester.toUpperCase()} on Date ${testDate.toUpperCase()}.`);
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
            bandColor === 'r' ? 'bg-red-100 text-red-800' : ''
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