import { render, screen, fireEvent } from "@testing-library/react";
import VisitsView from "./VisitsView";
import { TabResponse, FetchOption, SortField } from "../../types";
import { describe, it, expect, vi } from "vitest";

const mockData: TabResponse = {
  visitTab: [
    { count: 5, subjectOfInterest: "Subject 1" },
    { count: 10, subjectOfInterest: "Subject 2" },
    { count: 15, subjectOfInterest: "Subject 3" },
    { count: 20, subjectOfInterest: "Subject 4" },
    { count: 25, subjectOfInterest: "Subject 5" },
    { count: 30, subjectOfInterest: "Subject 6" },
    { count: 35, subjectOfInterest: "Subject 7" },
    { count: 40, subjectOfInterest: "Subject 8" },
    { count: 45, subjectOfInterest: "Subject 9" },
    { count: 50, subjectOfInterest: "Subject 10" },
    { count: 55, subjectOfInterest: "Subject 11" },
    { count: 65, subjectOfInterest: "Subject A" },
    { count: 66, subjectOfInterest: "Subject B" },
  ],
  fetchOption: {
    pageSize: 10,
    currentPage: 2,
    sort: {
      field: SortField.Count,
      ascending: true,
    },
    totalPage: 3,
  },
};

const mockFetchOption: FetchOption = {
  pageSize: 10,
  currentPage: 1,
  sort: {
    field: SortField.Count,
    ascending: true,
  },
  totalPage: 3,
};

describe("VisitsView Component", () => {
  it("renders the table with visit data", () => {
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    // Check for the headers
    expect(screen.getByText(/Count/i)).toBeInTheDocument();
    expect(screen.getByText("Subject of Interest")).toBeInTheDocument();

    // Check for specific data in table cells

    expect(
      screen.getByRole("cell", { name: /Subject A/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /Subject B/i })
    ).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={true}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls onSort with Count when Count header is clicked", () => {
    const onSortMock = vi.fn();
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={onSortMock}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    const countHeader = screen.getByText((content, element) => {
      return element
        ? content.includes("Count") && element.tagName.toLowerCase() === "th"
        : false;
    });

    fireEvent.click(countHeader);
    expect(onSortMock).toHaveBeenCalledWith(SortField.Count);
  });

  it("calls onSort with SubjectOfInterest when Subject header is clicked", () => {
    const onSortMock = vi.fn();
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={onSortMock}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    fireEvent.click(screen.getByText("Subject of Interest"));
    expect(onSortMock).toHaveBeenCalledWith(SortField.SubjectOfInterest);
  });

  it("disables Previous button when on the first page", () => {
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it("enables Next button when there are more pages", () => {
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it("calls onPageChange with the next page when Next button is clicked", () => {
    const onPageChangeMock = vi.fn();
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={onPageChangeMock}
        onPageSizeChange={() => {}}
        subjectLabel="Subject of Interest"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it("calls onPageSizeChange when a new page size is selected", () => {
    const onPageSizeChangeMock = vi.fn();
    render(
      <VisitsView
        mainResponse={mockData}
        isLoading={false}
        onSort={() => {}}
        initialFetchOption={mockFetchOption}
        onPageChange={() => {}}
        onPageSizeChange={onPageSizeChangeMock}
        subjectLabel="Subject of Interest"
      />
    );

    fireEvent.change(screen.getByLabelText(/page size/i), {
      target: { value: 20 },
    });
    expect(onPageSizeChangeMock).toHaveBeenCalledWith(20);
  });
});
