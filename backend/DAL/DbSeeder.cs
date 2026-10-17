using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.DAL
{
    // Runs on every server start (see Program.cs): empties every table and fills it
    // with the same test data, so everyone in the group starts from the same database.
    // Anything added while the server runs (accounts, cars, purchases) is gone after a restart.
    public static class DbSeeder
    {
        // Every seeded account uses this password
        public const string Password = "password123";

        public static async Task ResetAsync(AppDbContext db)
        {
            // Creates the tables from Migrations/ if the database file is new or out of date
            await db.Database.MigrateAsync();

            await DeleteAllAsync(db);
            await SeedAsync(db);
        }

        private static async Task DeleteAllAsync(AppDbContext db)
        {
            // Purchases point at cars and users, and cars point at dealers,
            // so delete in that order or the foreign keys block it
            await db.Purchases.ExecuteDeleteAsync();
            await db.Cars.ExecuteDeleteAsync();
            await db.Users.ExecuteDeleteAsync();

            // Start the ids at 1 again, so the seeded accounts always get the same ids
            await db.Database.ExecuteSqlRawAsync(
                "DELETE FROM sqlite_sequence WHERE name IN ('Users', 'Cars', 'Purchases')");
        }

        private static async Task SeedAsync(AppDbContext db)
        {
            // ---------- Buyers (ids 1-3) ----------

            var alex = NewBuyer("Alex Taylor", "alex@example.com", "0412 345 678", "12 Harbour St, Sydney", 45000);
            var sam = NewBuyer("Sam Lee", "sam@example.com", "0423 456 789", "4 Ocean Rd, Manly", 30000);
            var priya = NewBuyer("Priya Patel", "priya@example.com", "0434 567 890", "88 King St, Newtown", 52000);

            db.Buyers.AddRange(alex, sam, priya);
            await db.SaveChangesAsync();

            // ---------- Dealers (ids 4-6) ----------

            var harbour = NewDealer("Jordan Smith", "Harbour Motors", "jordan@harbourmotors.example", "02 9555 1000", "200 Harbour St, Sydney");
            var northside = NewDealer("Chris Wong", "Northside Autos", "chris@northside.example", "02 9555 2000", "15 Pacific Hwy, Chatswood");
            var bluewater = NewDealer("Taylor Brown", "Bluewater Cars", "taylor@bluewater.example", "02 9555 3000", "7 Beach Rd, Bondi");

            db.Dealers.AddRange(harbour, northside, bluewater);
            await db.SaveChangesAsync();

            // ---------- Cars ----------

            // Still for sale
            var corolla = NewCar(harbour, "Toyota", "Corolla", 2021, 32000, "White", 21500, "One owner, full service history, very economical.", 2);
            var cx5 = NewCar(harbour, "Mazda", "CX-5", 2020, 48000, "Red", 28900, "Roomy SUV with leather seats and reversing camera.", 1);
            var civic = NewCar(northside, "Honda", "Civic", 2019, 61000, "Blue", 17800, "Reliable hatchback, new tyres and brakes.", 3);
            var ranger = NewCar(northside, "Ford", "Ranger", 2022, 25000, "Grey", 46500, "Dual cab ute with tow bar and tub liner.", 1);
            var i30 = NewCar(bluewater, "Hyundai", "i30", 2018, 74000, "Silver", 13900, "Great first car, Apple CarPlay and Bluetooth.", 2);
            var model3 = NewCar(bluewater, "Tesla", "Model 3", 2023, 12000, "Black", 52000, "Long range, autopilot, still under warranty.", 1);

            // Sold out (only appear in purchase / sales history)
            var rav4 = NewCar(harbour, "Toyota", "RAV4", 2022, 18000, "Green", 39900, "Hybrid, excellent fuel economy, like new.", 0);
            var picanto = NewCar(bluewater, "Kia", "Picanto", 2017, 82000, "Yellow", 8900, "Cheap to run city car.", 0);
            var golf = NewCar(harbour, "Volkswagen", "Golf", 2020, 41000, "Blue", 24900, "Turbo petrol, sunroof, full logbook.", 0);
            var mx5 = NewCar(harbour, "Mazda", "MX-5", 2019, 29000, "Red", 31500, "Soft top, manual, weekend driven.", 0);

            db.Cars.AddRange(corolla, cx5, civic, ranger, i30, model3, rav4, picanto, golf, mx5);
            await db.SaveChangesAsync();

            // ---------- Purchases ----------

            // Spread over the last two years so the dealer Revenue tab has something to show
            // for every filter. Harbour Motors has the most sales.
            db.Purchases.AddRange(
                NewPurchase(alex, rav4, daysAgo: 26),
                NewPurchase(alex, picanto, daysAgo: 227),
                NewPurchase(sam, corolla, daysAgo: 2),
                NewPurchase(priya, cx5, daysAgo: 9),
                NewPurchase(sam, golf, daysAgo: 64),
                NewPurchase(priya, mx5, daysAgo: 150),
                NewPurchase(priya, corolla, daysAgo: 400),
                NewPurchase(sam, civic, daysAgo: 45),
                NewPurchase(alex, i30, daysAgo: 600)
            );
            await db.SaveChangesAsync();

            // Same money movement as POST /api/buy: each dealer has been paid for their sales
            foreach (var dealer in new[] { harbour, northside, bluewater })
            {
                dealer.Balance = await db.Purchases
                    .Where(purchase => purchase.DealerId == dealer.UserId)
                    .SumAsync(purchase => purchase.PaidAmount);
            }
            await db.SaveChangesAsync();
        }

        private static Buyer NewBuyer(string fullName, string email, string phone, string address, decimal balance)
        {
            return new Buyer
            {
                FullName = fullName,
                Email = email,
                Password = Password,
                PhoneNumber = phone,
                Address = address,
                Balance = balance
            };
        }

        private static Dealer NewDealer(string fullName, string dealershipName, string email, string phone, string address)
        {
            return new Dealer
            {
                FullName = fullName,
                DealershipName = dealershipName,
                Email = email,
                Password = Password,
                PhoneNumber = phone,
                Address = address,
                Balance = 0
            };
        }

        private static Car NewCar(
            Dealer dealer, string make, string model, int year, int mileage,
            string colour, decimal price, string description, int quantity)
        {
            return new Car
            {
                DealerId = dealer.UserId,
                Make = make,
                Model = model,
                Year = year,
                Mileage = mileage,
                Colour = colour,
                Price = price,
                Description = description,
                Quantity = quantity,
                IsSold = quantity == 0
            };
        }

        // The ids are already set because the buyers and cars were saved first.
        // The buyer balances above are what's left after these purchases.
        private static Purchase NewPurchase(Buyer buyer, Car car, int daysAgo)
        {
            return new Purchase
            {
                BuyerId = buyer.UserId,
                CarId = car.CarId,
                DealerId = car.DealerId!.Value,
                PaidAmount = car.Price,
                PurchaseDate = DateTime.UtcNow.AddDays(-daysAgo)
            };
        }
    }
}
