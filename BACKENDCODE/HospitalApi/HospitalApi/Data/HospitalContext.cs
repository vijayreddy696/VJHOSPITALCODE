using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalApi.Data
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options)
            : base(options) { }

        public DbSet<Hospital> Hospitals { get; set; }

        public DbSet<Department> Departments { get; set; }

        public DbSet<User> Users { get; set; }


        // Add other entities here

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(e => e.CreatedDate).IsModified = false;
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                }

            }

            return await base.SaveChangesAsync(cancellationToken);
        }

    }

}
