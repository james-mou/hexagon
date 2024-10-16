namespace Hexagon.LogReader.Utility.CustomError;

public class ParserExceptionResponse
{
    public int StatusCode { get; set; }
    public required string Message { get; set; }
    public required ParserErrorDetails Details { get; set; }
}