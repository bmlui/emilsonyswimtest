import React from "react";
import { SwimTestData } from "../page";

export default function SwimTestListRow({
  item,
  index,
}: {
  item: SwimTestData;
  index: number;
}) {
  const getColorClass = (bandColor: string) => {
    if (!bandColor) {
      return "bg-gray-100 text-gray-800";
    }
    switch (bandColor.toLowerCase()) {
      case "green":
      case "g":
        return "bg-emerald-50 text-emerald-700";
      case "yellow":
      case "y":
        return "bg-amber-50 text-amber-700";
      case "red":
      case "r":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <tr
      key={index}
      className={`${
        index % 2 === 0 ? "md:bg-gray-50" : "md:bg-white"
      } md:border-b md:border-gray-200 `}
    >
      <td className="hidden md:table-cell px-3 py-1 ">{item.firstName}</td>
      <td className="hidden md:table-cell px-3 py-1 ">{item.lastName}</td>
      <td className={`hidden md:table-cell px-3 py-1 whitespace-nowrap `}>
        <span
          className={`px-2 py-1 rounded-lg font-bold  ${getColorClass(
            item.bandColor
          )}`}
        >
          {item.bandColor.toLowerCase() === "g"
            ? "green"
            : item.bandColor.toLowerCase() === "y"
            ? "yellow"
            : item.bandColor.toLowerCase() === "r"
            ? "red"
            : item.bandColor}
        </span>
      </td>
      <td className="hidden md:table-cell px-3 py-1 ">{item.tester}</td>
      <td className="hidden md:table-cell px-3 py-1 whitespace-nowrap ">
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

      <td className="md:hidden text-sm mobiletable ">
        <div className={`bg-white p-2 m-1 rounded shadow`}>
          <div className="flex items-center space-x-2 text-sm mb-0">
            <div className="font-bold text-base">
              {item.firstName} {item.lastName}
            </div>
            <div
              className={`px-2 py-1 rounded-lg font-bold ${getColorClass(
                item.bandColor
              )}`}
            >
              {item.bandColor.toLowerCase() === "g"
                ? "green"
                : item.bandColor.toLowerCase() === "y"
                ? "yellow"
                : item.bandColor.toLowerCase() === "r"
                ? "red"
                : item.bandColor}
            </div>
          </div>
          <span className="text-gray-500">
            {(() => {
              try {
                return item.testDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              } catch {
                return "Invalid Date";
              }
            })()}
          </span>
          <span className=""> {item.tester}</span>
        </div>
      </td>
    </tr>
  );
}
