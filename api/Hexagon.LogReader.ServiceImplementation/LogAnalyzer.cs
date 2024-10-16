using Hexagon.LogReader.Entity;
using Hexagon.LogReader.RepositoryInterface;
using Hexagon.LogReader.ServiceInterface;
using Hexagon.LogReader.Utility.Exceptions;

namespace Hexagon.LogReader.ServiceImplementation;

public class LogAnalyzer(ILogRepository repository) : ILogAnalyzer
{

    private readonly ILogRepository _repository = repository;

    /////////////////////////
    /// Interface members ///
    /////////////////////////

    public (List<SubjectVisitCount> VisitTab, FetchOption FetchOpt) GetTabbedVisitsByHost(FetchOption fetchOpt, TimePeriod? range = null)
    {
        List<LogLine> rawData = GetFilteredData(range);
        var groupedData = rawData
            .GroupBy(log => log.Host)
            .Select(g => new SubjectVisitCount
            {
                SubjectOfInterest = g.Key,
                Count = g.Count()
            });
        var sortedData = GetSortedData(groupedData, fetchOpt.Sort);
        var paginatedData = ApplyPagination(sortedData, fetchOpt);
        return (paginatedData, fetchOpt);
    }

    public (List<SubjectVisitCount> VisitTab, FetchOption FetchOpt) GetTabbedVisitsByResource(FetchOption fetchOpt, TimePeriod? range = null)
    {
        List<LogLine> rawData = GetFilteredData(range);
        var groupedData = rawData
            .Where(log => log.RequestDetail.Verb == "GET" && log.ReturnCode == 200)
            .GroupBy(log => log.RequestDetail.Uri)
            .Select(g => new SubjectVisitCount
            {
                SubjectOfInterest = g.Key,
                Count = g.Count()
            });
        var sortedData = GetSortedData(groupedData, fetchOpt.Sort);
        var paginatedData = ApplyPagination(sortedData, fetchOpt);
        return (paginatedData, fetchOpt);
    }

    ///////////////////////////////////////////////////////
    /// From here on to the end are all private helpers ///
    ///////////////////////////////////////////////////////


    private List<LogLine> GetFilteredData(TimePeriod? range)
    {
        List<LogLine> rawData = _repository.FlatFetchAll();
        if (range != null)
        {
            rawData = rawData.Where(log => log.RequestTime >= range.Start && log.RequestTime <= range.End).ToList();
        }
        return rawData;
    }

    private static List<SubjectVisitCount> GetSortedData(IEnumerable<SubjectVisitCount> data, SortOption sort)
    {
        return sort.Field switch
        {
            SortField.SubjectOfInterest => sort.Ascending
                ? [.. data.OrderBy(s => s.SubjectOfInterest)]
                : [.. data.OrderByDescending(s => s.SubjectOfInterest)],
            SortField.Count => sort.Ascending
                ? [.. data.OrderBy(s => s.Count)]
                : [.. data.OrderByDescending(s => s.Count)],
            _ => data.ToList() // should never happen due to enum constraints, just here to make the linter happy
        };
    }

    private static List<SubjectVisitCount> ApplyPagination(List<SubjectVisitCount> groupedData, FetchOption fetchOpt)
    {
        int totalItems = groupedData.Count;
        int totalPages = (int)Math.Ceiling(totalItems / (double)fetchOpt.PageSize);
        if (fetchOpt.PageSize < 1)
        {
            fetchOpt.PageSize = 1;
        }
        if (fetchOpt.CurrentPage < 1)
        {
            fetchOpt.CurrentPage = 1;
        }
        if (fetchOpt.CurrentPage > totalPages)
        {
            fetchOpt.CurrentPage = totalPages;
        }

        var paginatedData = groupedData
            .Skip((fetchOpt.CurrentPage - 1) * fetchOpt.PageSize)
            .Take(fetchOpt.PageSize)
            .ToList();
        fetchOpt.TotalPage = totalPages;
        return paginatedData;
    }
}
