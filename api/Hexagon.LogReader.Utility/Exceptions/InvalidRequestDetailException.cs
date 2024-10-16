namespace Hexagon.LogReader.Utility.Exceptions;

public class InvalidRequestDetailException(int lineNumber, string lineContent)
    : ParserException("Invalid request detail format in the log file", lineNumber, lineContent);
