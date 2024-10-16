import React, { useState } from "react";
import { useGetHostVisitsQuery } from "./hostVisitApi";
import { FetchOption, SortField } from "../../types";
import VisitsView from "../../components/compound/VisitsView";
import RangePicker from "../../components/compound/RangePicker";
import ErrorDisplay from "../../components/elements/ErrorDisplay";

const HostVisitComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(SortField.Count);
  const [sortAscending, setSortAscending] = useState(false);

  const fetchOption: FetchOption = {
    pageSize,
    currentPage,
    sort: { ascending: sortAscending, field: sortField },
  };

  const minDate = new Date(Date.UTC(2024, 7, 1, 0, 0, 0));
  const maxDate = new Date(Date.UTC(2024, 8, 1, 0, 0, 0));
  minDate.setUTCHours(minDate.getUTCHours() - 4);
  maxDate.setUTCHours(maxDate.getUTCHours() - 4);

  const [timePeriod, setTimePeriod] = useState({
    start: minDate.toISOString(),
    end: maxDate.toISOString(),
  });

  const { data, error, isLoading } = useGetHostVisitsQuery({
    fetchOption,
    range: timePeriod,
  });

  const handleSortChange = (field: SortField) => {
    const isAscending = sortField === field ? !sortAscending : true;
    setSortField(field);
    setSortAscending(isAscending);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
  };

  const handleRangeChange = (range: { start: string; end: string }) => {
    setTimePeriod({
      start: new Date(range.start).toISOString(),
      end: new Date(range.end).toISOString(),
    });
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <ErrorDisplay error={error}></ErrorDisplay>;
  }

  return (
    <div>
      <RangePicker
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleRangeChange}
      />
      {data && data.visitTab && data.visitTab.length ? (
        <VisitsView
          mainResponse={data}
          isLoading={isLoading}
          initialFetchOption={fetchOption}
          onSort={handleSortChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          subjectLabel="Host"
        />
      ) : (
        <div>No data available for selected time range.</div>
      )}
    </div>
  );
};

export default HostVisitComponent;
