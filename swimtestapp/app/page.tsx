'use client';
import { useState, useEffect } from 'react';
import AddDataForm from './components/AddDataForm';
import SearchBar from './components/SearchBar';
import SwimTestList from './components/SwimTestList';
export interface SwimTestData {
  firstName: string;
  lastName: string;
  bandColor: string;
  tester: string;
  testDate: string;
  fullName: string;
}

export default function Home() {
  const [data, setData] = useState<SwimTestData[]>([]);
  const [filteredData, setFilteredData] = useState<SwimTestData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/swimtest')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.splice(0, 3);
        data = data.map((item: string) => ({
          firstName: item[1],
          lastName: item[0],
          bandColor: item[2],
          tester: item[3],
          testDate: item[4],
        }));
      
        // Add a full name column for searching purposes, removing all other characters then alphabet and making it uppercase
        data.forEach((item: SwimTestData) => {
          item.fullName = item.firstName + ' ' + item.lastName;
          item.fullName = item.fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
        });
        
        setData(data);
        setFilteredData(data);
        setIsLoading(false); // Set loading to false after data is fetched
      });
  }, []);

  const handleSearch = (query: string) => {
    const filtered = data.filter((item) =>
      item.fullName.includes(query.replace(/[^a-zA-Z]/g, '').toUpperCase())
    );
    if (query === '') {
      setFilteredData(data);
      return;
    }
    setFilteredData(filtered);
  };

  const addDataLocal = async (swimTestData: SwimTestData) => {
    setData([...data, swimTestData]);
    setFilteredData([...filteredData, swimTestData]);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Emilon Y Swim Test Log</h1>
      <div className=" max-w-xs mx-auto p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">Add Swim Test Data</h2>
        <AddDataForm onAdd={addDataLocal} data={data}/>
      </div>
      <div className="p-4 space-y-4 rounded-lg bg-gray-100 max-w-4xl mx-auto">
        <SearchBar onSearch={handleSearch} />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-transparent"></div>
          </div>
        ) : (
          <SwimTestList data={filteredData} />
        )}
      </div>
    </div>
  );
}