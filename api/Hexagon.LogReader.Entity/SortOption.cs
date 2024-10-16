namespace Hexagon.LogReader.Entity;

public enum SortField
{
    SubjectOfInterest,
    Count
}

public class SortOption
{
    public required SortField Field { get; set; }
    public required bool Ascending { get; set; }
}


