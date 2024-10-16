namespace Hexagon.LogReader.Utility.CustomError;

public class ParserErrorDetails
{
    public int LineNumber { get; set; }
    public required string LineContent { get; set; }
}