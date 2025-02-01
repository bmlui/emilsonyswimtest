import { useEffect, useState } from "react";
import { SwimTestData } from "../page";
import SwimTestListRow from "./SwimTestListRow";

export default function SwimTestList({ data }: { data: SwimTestData[] }) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SwimTestData;
    direction: "ascending" | "descending";
  }>({ key: "lastName", direction: "ascending" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 180;

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "testDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
        if (isNaN(aValue.getTime())) return 1; // Invalid dates at the end
        if (isNaN(bValue.getTime())) return -1; // Invalid dates at the end
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }

      return 0;
    });
  }

  const requestSort = (key: keyof SwimTestData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to the first page on sort
  };

  const getSortIndicator = (key: keyof SwimTestData) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div>
      <div className="md:hidden mb-2 text-sm mt-2">
        <label htmlFor="sortSelector" className="inline mr-2 ">
          Sort by:
        </label>
        <select
          id="sortSelector"
          name="sortSelector"
          className="inline  rounded bg-white appearance-auto "
          value={sortConfig.key}
          onChange={(e) => requestSort(e.target.value as keyof SwimTestData)}
        >
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="bandColor">Color</option>
          <option value="tester">Tester</option>
          <option value="testDate">Test Date</option>
        </select>

        <select
          id="directionSelector"
          name="directionSelector"
          className="ml-2 inline rounded bg-white appearance-auto "
          value={sortConfig.direction}
          onChange={() => requestSort(sortConfig.key as keyof SwimTestData)}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 md:mt-4">
        <thead className="border-b-3 border-gray-200 bg-white sticky top-0 font-bold">
          <tr className="hidden md:table-row">
            <th
              className="px-3 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("firstName")}
            >
              First Name {getSortIndicator("firstName")}
            </th>
            <th
              className="px-3 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("lastName")}
            >
              Last Name {getSortIndicator("lastName")}
            </th>
            <th
              className="px-3 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("bandColor")}
            >
              Color {getSortIndicator("bandColor")}
            </th>
            <th
              className="px-3 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("tester")}
            >
              Tester {getSortIndicator("tester")}
            </th>
            <th
              className="px-3 py-3 text-left text-xs  text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("testDate")}
            >
              Test Date {getSortIndicator("testDate")}
            </th>
          </tr>
        </thead>
        <tbody className=" text-s">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <SwimTestListRow key={index} item={item} index={index} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {paginatedData.length > 0 && sortedData.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded  ${
              currentPage === 1
                ? "cursor-default opacity-0"
                : "hover:opacity-80"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"} Previous
          </button>
          <span>
            Page{" "}
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className=" p-1 border rounded-sm bg-white"
            />{" "}
            of {totalPages}
          </span>

          <button
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded  ${
              currentPage === totalPages
                ? "cursor-default opacity-0"
                : "hover:opacity-80"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next {">"}
          </button>
        </div>
      )}
    </div>
  );
}
