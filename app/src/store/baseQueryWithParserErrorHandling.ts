import { fetchBaseQuery, BaseQueryApi } from "@reduxjs/toolkit/query/react";

import { BASE_API_URL } from "../common/configConstants";

import { Error422Response } from "../types";

// Define a custom base query to handle 422 errors
const baseQuery = fetchBaseQuery({ baseUrl: `${BASE_API_URL}/log-analyzer` });

export const baseQueryWithParserErrorHandling = async (
  args: {
    url: string;
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  },
  api: BaseQueryApi,
  extraOptions: Record<string, unknown> = {}
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const errorResponse = result.error as { data: unknown; status: number };

    // Only handle the 422 status
    if (errorResponse.status === 422) {
      const reponseData = errorResponse.data as Error422Response;

      return {
        error: {
          statusCode: errorResponse.status,
          message: reponseData.message,
          details: reponseData.details,
        },
      };
    }

    return result; // if it's not a 422 error, do nothing
  }

  return result; // just return the result if there is no error
};
