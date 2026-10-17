using backend.DAL;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealer
{
    // Everything the dealer Account page needs: details and sales history (the Revenue tab is worked out from the sales)
    public static class DealerAccountRoute
    {
        public static void MapDealerAccountRoute(this WebApplication app)
        {
            // The logged-in dealer's details and balance
            app.MapGet("/api/dealers/{dealerId:int}", async (int dealerId, AppDbContext db) =>
            {
                var dealer = await db.Dealers
                    .FirstOrDefaultAsync(dealer => dealer.UserId == dealerId);

                if (dealer == null)
                {
                    return Results.NotFound(new { message = "Dealer not found." });
                }

                return Results.Ok(ToProfile(dealer));
            });

            // Saves the Account details form
            app.MapPut("/api/dealers/{dealerId:int}", async (int dealerId, DealerUpdateRequest req, AppDbContext db) =>
            {
                var dealer = await db.Dealers
                    .FirstOrDefaultAsync(dealer => dealer.UserId == dealerId);

                if (dealer == null)
                {
                    return Results.NotFound(new { message = "Dealer not found." });
                }

                var email = req.Email.Trim();

                // Buyers and dealers share the Users table, so check every other account
                var emailTaken = await db.Users.AnyAsync(user =>
                    user.Email.ToLower() == email.ToLower() && user.UserId != dealerId);

                if (emailTaken)
                {
                    return Results.Conflict(new { message = $"{email} is already used by another account." });
                }

                dealer.FullName = req.FullName.Trim();
                dealer.DealershipName = req.DealershipName.Trim();
                dealer.Email = email;
                dealer.PhoneNumber = req.PhoneNumber.Trim();
                dealer.Address = req.Address.Trim();

                await db.SaveChangesAsync();

                return Results.Ok(ToProfile(dealer));
            });

            // Every car this dealer has sold and who bought it, newest first
            app.MapGet("/api/dealers/{dealerId:int}/sales", async (int dealerId, AppDbContext db) =>
            {
                var dealerExists = await db.Dealers
                    .AnyAsync(dealer => dealer.UserId == dealerId);

                if (!dealerExists)
                {
                    return Results.NotFound(new { message = "Dealer not found." });
                }

                var sales = await db.Purchases
                    .Where(purchase => purchase.DealerId == dealerId)
                    .OrderByDescending(purchase => purchase.PurchaseDate)
                    .Select(purchase => new
                    {
                        purchase.PurchaseId,
                        purchase.PaidAmount,
                        purchase.PurchaseDate,

                        Car = new
                        {
                            purchase.Car.CarId,
                            purchase.Car.Make,
                            purchase.Car.Model,
                            purchase.Car.Year,
                            purchase.Car.Mileage,
                            purchase.Car.Colour
                        },

                        Buyer = new
                        {
                            purchase.Buyer.UserId,
                            purchase.Buyer.FullName
                        }
                    })
                    .ToListAsync();

                return Results.Ok(sales);
            });
        }

        private static DealerProfileResponse ToProfile(backend.Models.Dealer dealer)
        {
            return new DealerProfileResponse(
                dealer.UserId,
                dealer.FullName,
                dealer.DealershipName,
                dealer.Email,
                dealer.PhoneNumber,
                dealer.Address,
                "Dealer",
                dealer.Balance
            );
        }
    }
}
