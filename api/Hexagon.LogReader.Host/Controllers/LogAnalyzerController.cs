using Hexagon.LogReader.Entity;
using Hexagon.LogReader.ServiceInterface;
using Hexagon.LogReader.Utility.CustomError;
using Hexagon.LogReader.Utility.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // Import the logging namespace

namespace Hexagon.LogReader.Host
{
    [ApiController]
    [Route("log-analyzer")]
    public class LogAnalyzerController(ILogAnalyzer service, ILogger<LogAnalyzerController> logger) : ControllerBase
    {
        private readonly ILogAnalyzer _service = service;
        private readonly ILogger<LogAnalyzerController> _logger = logger; // Declare a logger

        private static ParserExceptionResponse ContructParserExceptionResponse(ParserException ex)
        {
            return new ParserExceptionResponse
            {
                StatusCode = StatusCodes.Status422UnprocessableEntity,
                Message = ex.Message,
                Details = new ParserErrorDetails
                {
                    LineNumber = ex.LineNumber,
                    LineContent = ex.LineContent
                }
            };
        }

        [HttpGet("visits-by-host")]
        public async Task<IActionResult> GetTabbedVisitsByHost([FromQuery] FetchOption fetchOpt, [FromQuery] TimePeriod? range = null)
        {
            try
            {
                var (visitTab, fetchOption) = await Task.Run(() => _service.GetTabbedVisitsByHost(fetchOpt, range));
                return Ok(new { VisitTab = visitTab, FetchOption = fetchOption });
            }
            catch (ParserException parserException)
            {
                _logger.LogWarning(parserException, "ParserException occurred while fetching visits by host."); // Log the warning
                return UnprocessableEntity(ContructParserExceptionResponse(parserException));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while fetching visits by host."); // Log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "An internal server error occurred.");
            }
        }

        [HttpGet("visits-by-resource")]
        public async Task<IActionResult> GetTabbedVisitsByResource([FromQuery] FetchOption fetchOpt, [FromQuery] TimePeriod? range = null)
        {
            try
            {
                var (visitTab, fetchOption) = await Task.Run(() => _service.GetTabbedVisitsByResource(fetchOpt, range));
                return Ok(new { VisitTab = visitTab, FetchOption = fetchOption });
            }
            catch (ParserException parserException)
            {
                _logger.LogWarning(parserException, "ParserException occurred while fetching visits by resource."); // Log the warning
                return UnprocessableEntity(ContructParserExceptionResponse(parserException));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An internal server error occurred while fetching visits by resource."); // Log the error
                return StatusCode(StatusCodes.Status500InternalServerError, "An internal server error occurred.");
            }
        }
    }
}
