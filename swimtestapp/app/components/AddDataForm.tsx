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
    if (data.find((item) => item.fullName === fullName)) {
      alert(`Swimmer ${firstName.toUpperCase()} ${lastName.toUpperCase()} already exists`);
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

    const response = await fetch('/api/swimtest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(swimTestData),
    });

    if (response.ok) {
      onAdd(swimTestData);
      alert(`Swimmer ${firstName.toUpperCase()} ${lastName.toUpperCase()} added successfully`);
      setFirstName('');
      setLastName('');
    } else {
      alert('Server error. Failed to add swimmer');
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="relative">
        <select
          value={bandColor}
          onChange={(e) => setBandColor(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded appearance-none bg-white ${
            bandColor === 'Green' ? 'bg-green-100 text-green-800' :
            bandColor === 'Yellow' ? 'bg-yellow-100 text-yellow-800' :
            bandColor === 'Red' ? 'bg-red-100 text-red-800' : ''
          }`}
        >
          <option value="" disabled>Select Band Color</option>
          <option value="Green">Green</option>
          <option value="Yellow">Yellow</option>
          <option value="Red">Red</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </div>
      </div>
      <input
        type="text"
        value={tester}
        onChange={(e) => setTester(e.target.value)}
        placeholder="Lifeguard Tester"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Swimmer
      </button>
    </form>
  );
}