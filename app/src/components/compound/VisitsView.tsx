import React from "react";
import { FetchOption, SortField, TabResponse } from "../../types";

interface VisitsViewProps {
  mainResponse: TabResponse;
  isLoading: boolean;
  initialFetchOption: FetchOption;
  subjectLabel: string;
  onSort: (field: SortField) => void;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void; // Prop for page size change
}

const VisitsView: React.FC<VisitsViewProps> = ({
  mainResponse,
  isLoading,
  initialFetchOption,
  subjectLabel,
  onSort,
  onPageChange,
  onPageSizeChange,
}) => {
  if (isLoading) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th
              className="cursor-pointer w-1/4 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={() => onSort(SortField.Count)}
            >
              Count{" "}
              {initialFetchOption.sort.field === SortField.Count
                ? initialFetchOption.sort.ascending
                  ? "\u2191" // up
                  : "\u2193" // down
                : ""}
            </th>
            <th
              className="cursor-pointer px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={() => onSort(SortField.SubjectOfInterest)}
            >
              {subjectLabel}
              {initialFetchOption.sort.field === SortField.SubjectOfInterest
                ? initialFetchOption.sort.ascending
                  ? "\u2191" // up
                  : "\u2193" // down
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {mainResponse.visitTab.map((visit) => (
            <tr key={visit.subjectOfInterest} className="border-b">
              <td className="w-1/4 px-4 py-2 text-gray-600">{visit.count}</td>
              <td className="px-4 py-2 text-gray-600">
                {visit.subjectOfInterest}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <label htmlFor="pageSize" className="mr-2 text-gray-700">
            Page Size:
          </label>
          <select
            id="pageSize"
            value={initialFetchOption.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded p-2"
          >
            {[5, 10, 20, 30, 40].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onPageChange(1)}
          disabled={
            initialFetchOption.currentPage === 1 ||
            mainResponse.fetchOption.totalPage === 0
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow transition duration-200 hover:bg-blue-600 ${
            initialFetchOption.currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          First
        </button>
        <button
          onClick={() =>
            onPageChange(Math.max(initialFetchOption.currentPage - 1, 1))
          }
          disabled={
            initialFetchOption.currentPage === 1 ||
            mainResponse.fetchOption.totalPage === 0
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow transition duration-200 hover:bg-blue-600 ${
            initialFetchOption.currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {initialFetchOption.currentPage} of{" "}
          {mainResponse.fetchOption.totalPage}
        </span>
        <button
          onClick={() =>
            onPageChange(
              Math.min(
                initialFetchOption.currentPage + 1,
                mainResponse.fetchOption.totalPage || 1
              )
            )
          }
          disabled={
            initialFetchOption.currentPage ===
              mainResponse.fetchOption.totalPage ||
            mainResponse.fetchOption.totalPage === 0
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow transition duration-200 hover:bg-blue-600 ${
            initialFetchOption.currentPage ===
            mainResponse.fetchOption.totalPage
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(mainResponse.fetchOption.totalPage || 1)}
          disabled={
            initialFetchOption.currentPage ===
              mainResponse.fetchOption.totalPage ||
            mainResponse.fetchOption.totalPage === 0
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow transition duration-200 hover:bg-blue-600 ${
            initialFetchOption.currentPage ===
            mainResponse.fetchOption.totalPage
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default VisitsView;
