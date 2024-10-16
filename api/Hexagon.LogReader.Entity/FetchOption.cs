namespace Hexagon.LogReader.Entity;

public class FetchOption
{
    public required int PageSize { get; set; }
    public required int CurrentPage { get; set; }
    public required SortOption Sort { get; set; }
    public int? TotalPage { get; set; }
}

