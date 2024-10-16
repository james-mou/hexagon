using Hexagon.LogReader.Entity;

namespace Hexagon.LogReader.ServiceInterface;

public interface ILogAnalyzer
{

    (List<SubjectVisitCount> VisitTab, FetchOption FetchOpt) GetTabbedVisitsByHost(FetchOption fetchOpt, TimePeriod? range = null);

    (List<SubjectVisitCount> VisitTab, FetchOption FetchOpt) GetTabbedVisitsByResource(FetchOption fetchOpt, TimePeriod? range = null);
}

