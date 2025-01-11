"use client";
import { useCallback, useState } from "react";
import AddDataForm from "./components/AddDataForm";
import SearchBar from "./components/SearchBar";
import SwimTestList from "./components/SwimTestList";
import FetchSwimTestData from "./components/FetchSwimTestData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveIndicator from "./components/LiveIndicator";

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
  const [filteredData, setFilteredData] = useState<SwimTestData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const addDataLocal = useCallback((newData: SwimTestData) => {
    setData((prevData) => {
      if (prevData.some((item) => item.fullName === newData.fullName)) {
        return prevData;
      } else {
        return [...prevData, newData];
      }
    });
    setFilteredData((prevFilteredData) => {
      if (prevFilteredData.some((item) => item.fullName === newData.fullName)) {
        return prevFilteredData;
      } else {
        return [...prevFilteredData, newData];
      }
    });
  }, []);

  return (
    <div>
      <FetchSwimTestData
        setData={setData}
        setFilteredData={setFilteredData}
        setIsLoading={setIsLoading}
        onAdd={addDataLocal}
        setIsConnected={setIsConnected}
      />
      <div className="p-4 space-y-4">
        <Header />
        <div className=" max-w-xs mx-auto p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Add Swim Test Data</h2>
          <AddDataForm onAdd={addDataLocal} data={data} />
        </div>
        <div className="p-4 space-y-4 rounded-lg bg-gray-100 max-w-4xl mx-auto">
          <LiveIndicator isConnected={isConnected} />
          <SearchBar data={data} setFilteredData={setFilteredData} />
          {isLoading ? (
            <div className="flex justify-center items-center">
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
