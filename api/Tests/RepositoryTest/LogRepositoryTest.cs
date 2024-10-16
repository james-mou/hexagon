using System.IO;
using NUnit.Framework;
using Hexagon.LogReader.Entity;
using Hexagon.LogReader.Utility.Exceptions;
using System.Collections.Generic;
using Moq;
using Microsoft.Extensions.Logging;

namespace Hexagon.LogReader.RepositoryImplementation.Tests
{
    [TestFixture]
    public class LogRepositoryTests
    {
        private const string TestLogFilePath = "test_log.txt";
        private LogRepository _logRepository;

        [SetUp]
        public void SetUp()
        {
            var mockLogger = new Mock<ILogger<LogRepository>>();
            _logRepository = new LogRepository(TestLogFilePath, System.TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"), mockLogger.Object);
        }

        [TearDown]
        public void TearDown()
        {
            if (File.Exists(TestLogFilePath))
            {
                File.Delete(TestLogFilePath);
            }
        }

        [Test]
        public void FlatFetchAll_ShouldReturnLogLines_WhenValidFileIsProvided()
        {
            var logContent = new[]
            {
                "141.243.1.172 [29:23:53:25] \"GET /api/resource HTTP/1.1\" 200 1497",
                "192.168.0.1 [30:13:45:10] \"POST /api/submit HTTP/1.1\" 201 512"
            };
            File.WriteAllLines(TestLogFilePath, logContent);

            List<LogLine> result = _logRepository.FlatFetchAll();

            Assert.AreEqual(2, result.Count);
            Assert.AreEqual("141.243.1.172", result[0].Host);
            Assert.AreEqual("GET /api/resource HTTP/1.1", result[0].RequestDetail.Verb + " " + result[0].RequestDetail.Uri + " " + result[0].RequestDetail.Protocol);
            Assert.AreEqual(200, result[0].ReturnCode);
            Assert.AreEqual(1497, result[0].ReplySizeInBytes);
        }

        [Test]
        public void FlatFetchAll_ShouldThrowInvalidLineStructureException_WhenNoQuotedPart()
        {
            var logContent = new[]
            {
                "141.243.1.172 [29:23:53:25] GET /api/resource HTTP/1.1 200 1497"
            };
            File.WriteAllLines(TestLogFilePath, logContent);

            Assert.Throws<InvalidLineStructureException>(() => _logRepository.FlatFetchAll());
        }

        [Test]
        public void FlatFetchAll_ShouldThrowInvalidLineStructureException_WhenTooFewParts()
        {
            var logContent = new[]
            {
                "141.243.1.172 [29:23:53:25] \"GET /api/resource HTTP/1.1\" 200"
            };
            File.WriteAllLines(TestLogFilePath, logContent);

            Assert.Throws<InvalidLineStructureException>(() => _logRepository.FlatFetchAll());
        }

        [Test]
        public void FlatFetchAll_ShouldThrowInvalidRequestDetailException_WhenRequestDetailIsInvalid()
        {
            var logContent = new[]
            {
                "141.243.1.172 [29:23:53:25] \"GET\" 200 1497"
            };
            File.WriteAllLines(TestLogFilePath, logContent);

            Assert.Throws<InvalidRequestDetailException>(() => _logRepository.FlatFetchAll());
        }

        [Test]
        public void FlatFetchAll_ShouldThrowInvalidTimeFormatException_WhenTimeIsInvalid()
        {
            var logContent = new[]
            {
                "141.243.1.172 [invalid_time] \"GET /api/resource HTTP/1.1\" 200 1497"
            };
            File.WriteAllLines(TestLogFilePath, logContent);

            Assert.Throws<InvalidTimeFormatException>(() => _logRepository.FlatFetchAll());
        }
    }
}
