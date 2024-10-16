
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Hexagon.LogReader.Entity;
using Hexagon.LogReader.RepositoryInterface;
using Hexagon.LogReader.Utility.Exceptions;

namespace Hexagon.LogReader.RepositoryImplementation;

public class LogRepository(string logFilePath, TimeZoneInfo logFileZone, ILogger<LogRepository> logger) : ILogRepository
{
    private readonly string _logFilePath = logFilePath;
    private readonly TimeZoneInfo _logFileTimeZone = logFileZone;

    private readonly ILogger<LogRepository> _logger = logger;
    private const int ESTIMATED_LOG_FILE_LINE_NUMBER = 4096;

    public List<LogLine> FlatFetchAll()
    {
        // local variable to hold the cached value
        List<LogLine>? cachedLogLines = null;

        List<LogLine> fetchAllProxy()
        {
            cachedLogLines ??= FetchAllFromDisk(); // conditionally call the actual fetch
            return cachedLogLines; // always return the cached result
        }

        return fetchAllProxy();
    }

    private List<LogLine> FetchAllFromDisk()
    {
        List<LogLine> logLines = new(ESTIMATED_LOG_FILE_LINE_NUMBER);
        var lines = File.ReadAllLines(_logFilePath);

        for (int lineNumber = 0; lineNumber < lines.Length; lineNumber++)
        {
            var lineContent = lines[lineNumber];

            // find the quoted part, which contains the rquest detail, verb, resource and protocol
            var match = Regex.Match(lineContent, "\"(.*?)\"(?!.*\")");
            if (!match.Success)
            {
                _logger.LogError("Completely invalid line structure, the line number is {LineNumber} the line is {LineContent}", lineNumber, lineContent);
                throw new InvalidLineStructureException("Wrong structure of log line", lineNumber, lineContent);
            }

            // extract the quoted part (request detail), set it aside, and remove it from the orginal line
            string requestDetailStr = match.Groups[1].Value;
            string lineWithoutRequestDetail = lineContent.Replace(match.Value, "").Trim();

            // split the rest of the line into 4 parts based on whitespace
            var parts = lineWithoutRequestDetail.Split([' '], StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length != 4)
            {
                _logger.LogError("Wrong structure of log line, the line number is {LineNumber} the line is {LineContent}", lineNumber, lineContent);
                foreach (var part in parts)
                {
                    _logger.LogError("Part: {Part}", part);
                }
                throw new InvalidLineStructureException("Wrong structure of log line", lineNumber, lineContent);
            }

            // reconstruct the parts array, inserting the request detail at the correct position
            var reconstructedParts = new string[5];
            reconstructedParts[0] = parts[0]; // host
            reconstructedParts[1] = parts[1]; // request time
            reconstructedParts[2] = requestDetailStr; // request detail
            reconstructedParts[3] = parts[2]; // return code
            reconstructedParts[4] = parts[3]; // reply size

            string host = reconstructedParts[0];
            string requestTimeStr = reconstructedParts[1].Trim('[', ']');


            if (!int.TryParse(reconstructedParts[3], out int returnCode))
            {
                _logger.LogError("No return code, the line number is {LineNumber} the line is {LineContent}", lineNumber, lineContent);
                throw new InvalidLineStructureException("No return code", lineNumber, lineContent);
            }
            if (!int.TryParse(reconstructedParts[4], out int replySize))
            {
                replySize = 0;
            }
            if (!TryParseRequestTime(requestTimeStr, out DateTime requestTime))
            {
                _logger.LogError("Failure to parse request time, the line number is {LineNumber} the line is {LineContent}", lineNumber, lineContent);
                throw new InvalidTimeFormatException(lineNumber, lineContent);
            }

            if (!TryParseRequestDetail(reconstructedParts[2], lineNumber, lineContent, out RequestDetail requestDetail))
            {
                if (returnCode == 200)
                {
                    throw new InvalidRequestDetailException(lineNumber, lineContent);
                }

                continue;
            }

            logLines.Add(new LogLine
            {
                Host = host,
                RequestTime = requestTime,
                RequestDetail = requestDetail,
                ReturnCode = returnCode,
                ReplySizeInBytes = replySize
            });

        }

        return logLines;
    }


    private bool TryParseRequestTime(string requestTimeStr, out DateTime requestTime)
    {
        var timeParts = requestTimeStr.Split(':');

        if (timeParts.Length == 4 &&
            int.TryParse(timeParts[0], out int days) &&
            int.TryParse(timeParts[1], out int hours) &&
            int.TryParse(timeParts[2], out int minutes) &&
            int.TryParse(timeParts[3], out int seconds))
        {
            // create a new DateTime object assuming the current year and August month
            DateTime requestDateTime = new DateTime(DateTime.Now.Year, 8, days, hours, minutes, seconds);

            requestTime = TimeZoneInfo.ConvertTimeToUtc(requestDateTime, _logFileTimeZone);

            return true;
        }

        requestTime = default;
        return false;
    }
    private bool TryParseRequestDetail(string requestDetailStr, int lineNumber, string lineContent, out RequestDetail requestDetail)
    {
        requestDetail = new RequestDetail
        {
            Verb = "",
            Uri = "",
            Protocol = ""
        };

        var parts = requestDetailStr.Split([' '], StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length < 2)
        {
            _logger.LogWarning("Bad request detail, the line number is {LineNumber} the line is {LineContent}", lineNumber, lineContent);
            return false;
        }

        requestDetail.Verb = parts[0];
        requestDetail.Uri = parts[1];
        requestDetail.Protocol = parts.Length > 2 ? parts[2] : string.Empty;


        return true;
    }

}
