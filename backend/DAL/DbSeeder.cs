using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL
{
    // Sample data for development. Program.cs runs this on startup in Development only.
    public static class DbSeeder
    {
        // Every sample buyer logs in with this password
        public const string SamplePassword = "password123";

        public static async Task SeedBuyersAsync(AppDbContext db, IPasswordHasher<User> hasher)
        {
            var sampleBuyers = new List<Buyer>
            {
                new Buyer { FullName = "Sam Lee", Email = "sam@example.com", PhoneNumber = "0423 456 789", Address = "4 Ocean Rd, Manly", Balance = 30000 },
                new Buyer { FullName = "Priya Patel", Email = "priya@example.com", PhoneNumber = "0434 567 890", Address = "88 King St, Newtown", Balance = 52000 },
                new Buyer { FullName = "Mia Chen", Email = "mia@example.com", PhoneNumber = "0445 678 901", Address = "21 George St, Parramatta", Balance = 18500 },
                new Buyer { FullName = "Liam O'Brien", Email = "liam@example.com", PhoneNumber = "0456 789 012", Address = "9 Bay St, Glebe", Balance = 75000 },
                new Buyer { FullName = "Zara Ahmed", Email = "zara@example.com", PhoneNumber = "0467 890 123", Address = "302 Pitt St, Sydney", Balance = 0 }
            };

            // Only add buyers whose email isn't taken yet, so this is safe to run on every startup
            var takenEmails = await db.Users.Select(user => user.Email).ToListAsync();
            var newBuyers = sampleBuyers
                .Where(buyer => !takenEmails.Contains(buyer.Email))
                .ToList();

            foreach (var buyer in newBuyers)
            {
                buyer.Password = hasher.HashPassword(buyer, SamplePassword);
            }

            db.Buyers.AddRange(newBuyers);
            await db.SaveChangesAsync();
        }
    }
}
