
using Moq;
using Hexagon.LogReader.Entity;
using Hexagon.LogReader.RepositoryInterface;


namespace Hexagon.LogReader.ServiceImplementation.Tests
{
    [TestFixture]
    public class LogAnalyzerTests
    {
        private Mock<ILogRepository> _mockRepository;
        private LogAnalyzer _logAnalyzer;

        [SetUp]
        public void SetUp()
        {
            _mockRepository = new Mock<ILogRepository>();
            _logAnalyzer = new LogAnalyzer(_mockRepository.Object);
        }

        [Test]
        public void GetMostFrequentlyVisitingHost_ReturnsCorrectVisitCount()
        {
            // Arrange
            var fakeLogs = new List<LogLine>
            {
                new LogLine
                {
                    Host = "host1",
                    RequestTime = DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource1", Protocol = "HTTP/1.1" },
                    ReturnCode = 200,
                    ReplySizeInBytes = 150
                },
                new LogLine
                {
                    Host = "host2",
                    RequestTime = DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource2", Protocol = "HTTP/1.1" },
                    ReturnCode = 200,
                    ReplySizeInBytes = 200
                },
                new LogLine
                {
                    Host = "host1",
                    RequestTime = DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource1", Protocol = "HTTP/1.1" },
                    ReturnCode = 200,
                    ReplySizeInBytes = 150
                }
            };

            _mockRepository.Setup(repo => repo.FlatFetchAll()).Returns(fakeLogs);
            var fetchOpt = new FetchOption
            {
                PageSize = 2,
                CurrentPage = 1,
                Sort = new SortOption
                {
                    Ascending = false,
                    Field = SortField.Count
                }
            };

            var (VisitTab, FetchOpt) = _logAnalyzer.GetTabbedVisitsByHost(fetchOpt);

            Assert.That(VisitTab.Count, Is.EqualTo(2)); // Expecting 2 unique hosts
            Assert.That(VisitTab.First().SubjectOfInterest, Is.EqualTo("host1")); // Most visits
            Assert.That(VisitTab.First().Count, Is.EqualTo(2)); // Count for host1
        }

        [Test]
        public void GetMostVistedResources_WithValidData_ReturnsCorrectCount()
        {
            // Arrange
            var fakeLogs = new List<LogLine>
            {
                new LogLine
                {
                    Host = "host1",
                    RequestTime = DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource1", Protocol = "HTTP/1.1" },
                    ReturnCode = 200,
                    ReplySizeInBytes = 150
                },
                new LogLine
                {
                    Host = "host2",
                    RequestTime = DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource2", Protocol = "HTTP/1.1"},
                    ReturnCode = 200,
                    ReplySizeInBytes = 200
                },
                new LogLine
                {
                    Host = "host1",
                    RequestTime =DateTime.Now,
                    RequestDetail = new RequestDetail { Verb = "GET", Uri = "/resource1", Protocol = "HTTP/1.1" },
                    ReturnCode = 200,
                    ReplySizeInBytes = 150
                }
            };

            _mockRepository.Setup(repo => repo.FlatFetchAll()).Returns(fakeLogs);

            var fetchOpt = new FetchOption
            {
                PageSize = 2,
                CurrentPage = 1,
                Sort = new SortOption
                {
                    Ascending = true,
                    Field = SortField.Count
                }
            };
            // Act
            var (VisitTab, FetchOpt) = _logAnalyzer.GetTabbedVisitsByResource(fetchOpt);

            // Assert
            Assert.That(VisitTab.Count, Is.EqualTo(2)); // Expecting 2 unique resources
            Assert.That(VisitTab.First().SubjectOfInterest, Is.EqualTo("/resource2")); // Least visits
            Assert.That(VisitTab.First().Count, Is.EqualTo(1)); // Count for resource2
        }




    }
}
