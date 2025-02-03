"use client";
import { useMemo, useCallback, useState } from "react";
import AddDataForm from "./components/AddDataForm";
import SearchBar from "./components/SearchBar";
import SwimTestList from "./components/SwimTestList";
import FetchSwimTestData from "./components/FetchSwimTestData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveIndicator from "./components/LiveIndicator";
import PurgeCache from "./components/PurgeCache";

export interface SwimTestData {
  firstName: string;
  lastName: string;
  bandColor: string;
  tester: string;
  testDate: Date;
  fullName: string;
}

export default function Home() {
  const [data, setData] = useState<SwimTestData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm === "") {
      return data;
    }
    return data.filter((item) => {
      return item.fullName.includes(
        searchTerm.replace(/[^a-zA-Z]/g, "").toUpperCase()
      );
    });
  }, [data, searchTerm]);

  const addDataLocal = useCallback((newData: SwimTestData) => {
    setData((prevData) => {
      if (prevData.some((item) => item.fullName === newData.fullName)) {
        return prevData;
      } else {
        localStorage.setItem(
          "swimTestData",
          JSON.stringify([...prevData, newData])
        );
        return [...prevData, newData];
      }
    });
  }, []);

  return (
    <div>
      <FetchSwimTestData
        setData={setData}
        setIsLoading={setIsLoading}
        onAdd={addDataLocal}
        setIsConnected={setIsConnected}
        setLastUpdated={setLastUpdated}
      />
      <div className="p-4 space-y-4">
        <Header />
        <div className=" max-w-xs mx-auto p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Add Swim Test Data</h2>
          <AddDataForm onAdd={addDataLocal} data={data} />
        </div>
        <div className="p-4 space-y-4 rounded-lg bg-gray-100 max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex ">
              <LiveIndicator isConnected={isConnected} />
              <PurgeCache
                lastUpdated={lastUpdated}
                setLastUpdated={setLastUpdated}
                setData={setData}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
          <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
          {isLoading ? (
            <div className="flex justify-center items-center m-5">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent"></div>
            </div>
          ) : (
            <SwimTestList data={filteredData} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
