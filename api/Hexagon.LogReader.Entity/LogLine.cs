namespace Hexagon.LogReader.Entity;

public class LogLine
{
    public required string Host { get; set; }
    public required DateTime RequestTime { get; set; }
    public required RequestDetail RequestDetail { get; set; }
    public required int ReturnCode { get; set; }
    public required int ReplySizeInBytes { get; set; }
}


