import { useEffect, useState } from "react";
import { SwimTestData } from "../page";

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

  const getColorClass = (bandColor: string) => {
    if (!bandColor) {
      return "bg-gray-100 text-gray-800";
    }
    switch (bandColor.toLowerCase()) {
      case "green":
      case "g":
        return "bg-green-100 text-green-800";
      case "yellow":
      case "y":
        return "bg-yellow-100 text-yellow-800";
      case "red":
      case "r":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white sticky top-0 font-bold">
          <tr>
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
        <tbody className="bg-white divide-y divide-gray-200 text-s">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-3 py-1 ">{item.firstName}</td>
                <td className="px-3 py-1 ">{item.lastName}</td>
                <td
                  className={`px-3 py-1 whitespace-nowrap ${getColorClass(
                    item.bandColor
                  )}`}
                >
                  {item.bandColor.toLowerCase() === "g"
                    ? "Green"
                    : item.bandColor.toLowerCase() === "y"
                    ? "Yellow"
                    : item.bandColor.toLowerCase() === "r"
                    ? "Red"
                    : item.bandColor}
                </td>
                <td className="px-3 py-1 ">{item.tester}</td>
                <td className="px-3 py-1 whitespace-nowrap">
                  {(() => {
                    try {
                      return item.testDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                    } catch {
                      return "Invalid Date";
                    }
                  })()}
                </td>
              </tr>
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
      {paginatedData.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded  ${
              currentPage === 1 ? "cursor-not-allowed" : "hover:opacity-80"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
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
              className=" p-1 border rounded"
            />{" "}
            of {totalPages}
          </span>

          <button
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded  ${
              currentPage === totalPages
                ? "cursor-not-allowed"
                : "hover:opacity-80"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
