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

        public DbSet<Specialization> Specialization { get; set; }

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Hospital owner one-to-one relationship
            modelBuilder.Entity<Hospital>()
                .HasOne(h => h.OwnerDetails)
                .WithOne()  // no navigation property on User back to Hospital as owner
                .HasForeignKey<Hospital>(h => h.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many users belong to one hospital
            modelBuilder.Entity<User>()
                .HasOne(u => u.Hospital)
                .WithMany(h => h.Users)
                .HasForeignKey(u => u.HospitalId)
                .OnDelete(DeleteBehavior.Cascade);
        }


    }

}
