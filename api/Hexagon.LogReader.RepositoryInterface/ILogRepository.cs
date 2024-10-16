using Hexagon.LogReader.Entity;

namespace Hexagon.LogReader.RepositoryInterface;
public interface ILogRepository
{

    List<LogLine> FlatFetchAll();
}
