import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (!query) return;
    onSearch(query);
    setIsSearched(true);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
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
        onKeyPress={handleKeyPress}
        placeholder="Search"
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