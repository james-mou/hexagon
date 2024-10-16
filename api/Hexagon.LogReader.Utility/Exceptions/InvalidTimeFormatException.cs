namespace Hexagon.LogReader.Utility.Exceptions;

public class InvalidTimeFormatException(int lineNumber, string lineContent)
    : ParserException("Invalid time format", lineNumber, lineContent);
