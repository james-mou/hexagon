namespace Hexagon.LogReader.Utility.Exceptions;

public class ParserException(string message, int lineNumber, string lineContent) : Exception(message)
{
    public int LineNumber { get; } = lineNumber;
    public string LineContent { get; } = lineContent;
}
