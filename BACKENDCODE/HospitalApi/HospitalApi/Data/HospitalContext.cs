using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Data
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options)
            : base(options) { }

        public DbSet<Hospital> Hospitals { get; set; }
        // Add other entities here
    }

}
