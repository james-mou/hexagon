import { createApi } from "@reduxjs/toolkit/query/react";
import { FetchOption, TabResponse, TimePeriod } from "../../types";
import { baseQueryWithParserErrorHandling } from "../../store/baseQueryWithParserErrorHandling";

// Define the API service
export const hostVisitApi = createApi({
  reducerPath: "hostVisitApi",
  baseQuery: baseQueryWithParserErrorHandling,
  endpoints: (builder) => ({
    getHostVisits: builder.query<
      TabResponse,
      { fetchOption: FetchOption; range?: TimePeriod | null }
    >({
      query: ({ fetchOption, range }) => {
        const queryParams = new URLSearchParams({
          pageSize: fetchOption.pageSize.toString(),
          currentPage: fetchOption.currentPage.toString(),
          "sort.field": fetchOption.sort.field,
          "sort.ascending": fetchOption.sort.ascending.toString(),
        });

        if (range) {
          queryParams.append("start", range.start);
          queryParams.append("end", range.end);
        }

        return {
          url: `visits-by-host?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetHostVisitsQuery } = hostVisitApi;
