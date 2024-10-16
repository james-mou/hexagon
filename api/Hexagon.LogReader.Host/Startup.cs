using System.Text.Json;
using Hexagon.LogReader.RepositoryInterface;
using Hexagon.LogReader.RepositoryImplementation;
using Hexagon.LogReader.ServiceInterface;
using Hexagon.LogReader.ServiceImplementation;

namespace Hexagon.LogReader.Host
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // to be tightened for production
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            // make the returned json a more compliant with frontend naming conventions
            // this is two-way, so the incoming json in camel case will be mapped back
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            services.AddSingleton<ILogRepository>(provider =>
            {
                var env = provider.GetRequiredService<IWebHostEnvironment>();
                var logFilePath = Path.Combine(env.ContentRootPath, "Data", "epa-http.txt");
                var logTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
                var logger = provider.GetRequiredService<ILogger<LogRepository>>();

                return new LogRepository(logFilePath, logTimeZone, logger);
            });

            services.AddSingleton<ILogAnalyzer, LogAnalyzer>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
