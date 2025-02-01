import { useState } from "react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (arg0: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const handleAction = () => {
    if (!query || query === "") {
      setQuery("");
      setIsSearched(false);
      setSearchTerm("");
    } else if (query === searchTerm) {
      return;
    } else {
      setIsSearched(true);
      setSearchTerm(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsSearched(false);
    setSearchTerm("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAction();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
      <div className="flex space-x-2">
        <input
          type="search"
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
          className="grow p-2 border border-gray-300 bg-white rounded-sm"
        />
        <button
          onClick={isSearched ? handleClear : handleAction}
          className={`px-4 py-2 rounded hover:opacity-80 ${
            isSearched ? "bg-gray-500" : "bg-blue-600"
          } text-white`}
        >
          {isSearched ? "Clear" : "Search"}
        </button>
      </div>
      {isSearched && (
        <div className="mt-2 ">
          Current Search:
          <span className="font-bold"> {searchTerm}</span>
        </div>
      )}
    </form>
  );
}
