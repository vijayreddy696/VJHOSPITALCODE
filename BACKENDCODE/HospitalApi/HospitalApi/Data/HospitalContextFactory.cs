using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Data
{
    public class HospitalContextFactory : IDesignTimeDbContextFactory<HospitalContext>
    {
        public HospitalContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<HospitalContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DevelopmentConnection"));

            return new HospitalContext(optionsBuilder.Options);
        }
    }
}
