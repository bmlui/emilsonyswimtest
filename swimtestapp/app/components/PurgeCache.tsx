import React, { useState, useEffect, useRef, FC } from "react";
import { purgeLocalCache, fetchData } from "./FetchSwimTestData";
import { SwimTestData } from "../page";

interface PurgeCacheProps {
  lastUpdated: Date;
  setLastUpdated: (arg0: Date) => void;
  setData: (arg0: SwimTestData[]) => void;
  setIsLoading: (arg0: boolean) => void;
}

const PurgeCache: FC<PurgeCacheProps> = ({
  lastUpdated,
  setLastUpdated,
  setData,
  setIsLoading,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePurgeCache = (): void => {
    purgeLocalCache();
    alert("Local cache purged. Fetching new data...");
    fetchData(setData, setIsLoading, setLastUpdated);
    setTimeSinceLastUpdate("now");
  };

  const handleShowDropdown = (): void => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / 60000
      );
      if (diffInMinutes < 1) {
        setTimeSinceLastUpdate("now");
      } else {
        setTimeSinceLastUpdate(`${diffInMinutes} min ago`);
      }
    }
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleShowDropdown}
        className="bg-transparent hover:opacity-80 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute bg-white shadow-xl z-10 p-4 rounded mt-2 w-48 left-0 cursor-default">
          <p className="text-sm mb-1">Last updated: {timeSinceLastUpdate}</p>
          <button
            onClick={handlePurgeCache}
            className="bg-red-500 text-white text-sm p-2 rounded border-none cursor-pointer hover:opacity-80"
          >
            Force Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default PurgeCache;
