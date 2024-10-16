import React, { useState } from "react";

interface RangePickerProps {
  minDate: Date;
  maxDate: Date;
  onChange: (range: { start: string; end: string }) => void;
}

const RangePicker: React.FC<RangePickerProps> = ({
  minDate,
  maxDate,
  onChange,
}) => {
  const [startDate, setStartDate] = useState(
    new Date(minDate).toISOString().slice(0, 16) // date-time input requires this format
  );
  const [endDate, setEndDate] = useState(
    new Date(maxDate).toISOString().slice(0, 16)
  );

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSetRange = () => {
    // Construct UTC date strings for output
    const utcStartDate = new Date(startDate + "Z").toISOString();
    const utcEndDate = new Date(endDate + "Z").toISOString();
    onChange({ start: utcStartDate, end: utcEndDate });
  };

  const isStartDateAfterEndDate = new Date(startDate) >= new Date(endDate);

  return (
    <div className="flex items-center mb-4 space-x-4">
      <input
        type="datetime-local"
        value={startDate}
        onChange={handleStartChange}
        min={new Date(minDate).toISOString().slice(0, 16)}
        max={endDate}
        className="border rounded p-2"
      />
      <input
        type="datetime-local"
        value={endDate}
        onChange={handleEndChange}
        min={startDate}
        max={new Date(maxDate).toISOString().slice(0, 16)}
        className="border rounded p-2"
      />
      <button
        onClick={handleSetRange}
        className={`bg-blue-500 text-white rounded p-2 hover:bg-blue-600 ${
          isStartDateAfterEndDate ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isStartDateAfterEndDate}
      >
        Set Range
      </button>
    </div>
  );
};

export default RangePicker;
