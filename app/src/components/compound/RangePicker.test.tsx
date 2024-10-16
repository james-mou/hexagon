import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RangePicker from "./RangePicker";

describe("RangePicker", () => {
  const mockOnChange = vi.fn();

  it("renders with initial dates", () => {
    const minDate = new Date("2023-01-01");
    const maxDate = new Date("2023-12-31");

    render(
      <RangePicker
        minDate={minDate}
        maxDate={maxDate}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue("2023-01-01T00:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-12-31T00:00")).toBeInTheDocument();
  });

  it("calls onChange with correct UTC dates when Set Range is clicked", () => {
    const minDate = new Date("2023-01-01");
    const maxDate = new Date("2023-12-31");

    render(
      <RangePicker
        minDate={minDate}
        maxDate={maxDate}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByDisplayValue("2023-01-01T00:00"), {
      target: { value: "2023-06-01T00:00" },
    });
    fireEvent.change(screen.getByDisplayValue("2023-12-31T00:00"), {
      target: { value: "2023-12-01T00:00" },
    });

    fireEvent.click(screen.getByText("Set Range"));

    expect(mockOnChange).toHaveBeenCalledWith({
      start: new Date("2023-06-01T00:00Z").toISOString(),
      end: new Date("2023-12-01T00:00Z").toISOString(),
    });
  });

  it("disables Set Range button if start date is after end date", () => {
    const minDate = new Date("2023-01-01");
    const maxDate = new Date("2023-12-31");

    render(
      <RangePicker
        minDate={minDate}
        maxDate={maxDate}
        onChange={mockOnChange}
      />
    );

    const startInput = screen.getByDisplayValue("2023-01-01T00:00");
    const endInput = screen.getByDisplayValue("2023-12-31T00:00");

    fireEvent.change(startInput, {
      target: { value: "2023-12-31T00:00" },
    });
    fireEvent.change(endInput, {
      target: { value: "2023-01-01T00:00" },
    });

    expect(screen.getByText("Set Range")).toBeDisabled();
  });
});
