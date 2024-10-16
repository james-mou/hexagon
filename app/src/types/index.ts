export enum SortField {
  SubjectOfInterest = "SubjectOfInterest",
  Count = "Count",
}

export interface Error422Response {
  statusCode: number;
  message: string;
  details?: { lineNumber: number; lineContent: string };
}

export interface SortOption {
  field: SortField;
  ascending: boolean;
}

export interface FetchOption {
  pageSize: number;
  currentPage: number;
  sort: SortOption;
  totalPage?: number | null;
}

export interface SubjectVisitCount {
  subjectOfInterest: string;
  count: number;
}

export interface TimePeriod {
  start: string;
  end: string;
}

export interface TabResponse {
  visitTab: SubjectVisitCount[];
  fetchOption: FetchOption;
}
