using Microsoft.VisualBasic;

namespace Hexagon.LogReader.Utility.Exceptions;

public class InvalidLineStructureException(string message, int lineNumber, string lineContent)
    : ParserException("Invalid line structure, " + message, lineNumber, lineContent);
