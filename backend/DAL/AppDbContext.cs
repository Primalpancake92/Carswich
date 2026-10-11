using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Buyer> Buyers => Set<Buyer>();
        public DbSet<Dealer> Dealers => Set<Dealer>();
        public DbSet<Car> Cars => Set<Car>();
        public DbSet<Purchase> Purchases => Set<Purchase>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(user =>
            {
                user.ToTable("Users");
                user.HasKey(u => u.UserId);

                user.HasDiscriminator<string>("UserType")
                    .HasValue<Buyer>("Buyer")
                    .HasValue<Dealer>("Dealer");

                user.Property(u => u.FullName).IsRequired().HasMaxLength(100);
                user.Property(u => u.Email).IsRequired().HasMaxLength(255);
                user.Property(u => u.Password).IsRequired();
                user.Property(u => u.PhoneNumber).HasMaxLength(30);
                user.Property(u => u.Address).HasMaxLength(255);

                user.HasIndex(u => u.Email).IsUnique();
            });

            modelBuilder.Entity<Buyer>()
                .Property(b => b.Balance)
                .HasColumnName("Balance")
                .HasConversion<double>();

            modelBuilder.Entity<Dealer>(dealer =>
            {
                dealer.Property(d => d.DealershipName).HasMaxLength(150);

                dealer.Property(d => d.Balance)
                    .HasColumnName("Balance")
                    .HasConversion<double>();

                dealer.HasMany(d => d.CarsAvailable)
                    .WithOne()
                    .HasForeignKey(c => c.DealerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Car>(car =>
            {
                car.ToTable("Cars");
                car.HasKey(c => c.CarId);

                car.Property(c => c.Make).IsRequired().HasMaxLength(50);
                car.Property(c => c.Model).IsRequired().HasMaxLength(50);
                car.Property(c => c.Colour).HasMaxLength(30);
                car.Property(c => c.Description).HasMaxLength(2000);
                car.Property(c => c.Price).HasConversion<double>();
            });

            modelBuilder.Entity<Purchase>(purchase =>
            {

                purchase.ToTable("Purchases");
                purchase.HasKey(pur => pur.PurchaseId);

                purchase.Property(pur => pur.PaidAmount).IsRequired().HasConversion<double>();
                purchase.Property(pur => pur.PurchaseDate).IsRequired();

                purchase.HasOne<Car>()
                    .WithMany()
                    .HasForeignKey(pur => pur.CarId)
                    .OnDelete(DeleteBehavior.Restrict);

                purchase.HasOne<Buyer>()
                    .WithMany()
                    .HasForeignKey(pur => pur.BuyerId)
                    .OnDelete(DeleteBehavior.Restrict);

                purchase.HasOne<Dealer>()
                    .WithMany()
                    .HasForeignKey(pur => pur.DealerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
