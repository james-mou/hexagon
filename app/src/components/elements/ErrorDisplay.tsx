import React from "react";
import { Error422Response } from "../../types/index";

interface ErrorDisplayProps {
  error: unknown;
}

const isError422Response = (error: unknown): error is Error422Response => {
  const isObject = typeof error === "object" && error !== null;
  const hasStatusCode = isObject && "statusCode" in error;
  const hasMessage = isObject && "message" in error;
  const isStatusCodeNumber =
    hasStatusCode && typeof (error as Error422Response).statusCode === "number";
  const isMessageString =
    hasMessage && typeof (error as Error422Response).message === "string";

  return (
    isObject &&
    hasStatusCode &&
    hasMessage &&
    isStatusCodeNumber &&
    isMessageString
  );
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!isError422Response(error)) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-2">Unknown Error</h1>
        <p className="mb-4">
          An unknown error occurred. Please check the details for more
          information.
        </p>
        <code className="bg-yellow-50 p-1 rounded-md">
          {JSON.stringify(error, null, 2)}
        </code>
      </div>
    );
  }

  const castedError = error as Error422Response;

  return (
    <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-2">
        Error {castedError.statusCode} - Parsing Error
      </h1>
      <p className="mb-4">{castedError.message}</p>

      {castedError.details && (
        <div className="bg-gray-50 p-3 border border-gray-300 rounded-md">
          <p className="font-semibold text-gray-700">Error Details:</p>
          <p className="mt-2">
            <strong>Line Number:</strong> {castedError.details.lineNumber}
          </p>
          <p className="mt-2">
            <strong>Line Content:</strong>{" "}
            <code className="bg-gray-200 p-1 rounded-md block">
              {castedError.details.lineContent}
            </code>
          </p>
          <p className="mt-4 text-sm text-gray-600">
            The error occurred while parsing the line above. Please review it
            for issues.
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
