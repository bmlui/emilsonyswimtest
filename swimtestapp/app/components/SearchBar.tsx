import { useState } from 'react';
import { SwimTestData } from '../page';

export default function SearchBar({ data, setFilteredData }: { data: SwimTestData[]; setFilteredData: (filteredData: SwimTestData[]) => void }) {
  const [query, setQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);

    const handleSearch = () => {
      if (!query) {
        handleClear();
      } else {
        const filtered = data.filter((item) =>
          item.fullName.includes(query.replace(/[^a-zA-Z]/g, '').toUpperCase())
        );
        if (query === '') {
          setFilteredData(data);
          return;
        }
        setFilteredData(filtered);
          setIsSearched(true);
        }
  
    };

  const handleClear = () => {
    setQuery('');
    setFilteredData(data);
    setIsSearched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Search..."
        className="flex-grow p-2 border border-gray-300 rounded"
      />
      <button
        onClick={isSearched ? handleClear : handleSearch}
        className={`px-4 py-2 rounded hover:opacity-80 ${isSearched ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
      >
        {isSearched ? 'Clear' : 'Search'}
      </button>
    </div>
  );
}