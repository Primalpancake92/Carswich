using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerProfileRoute
    {
        public static void MapBuyerProfileRoute(this WebApplication app)
        {
            // The logged-in buyer's details and balance (used by every buyer page)
            app.MapGet("/api/buyers/{buyerId:int}", async (int buyerId, AppDbContext db) =>
            {
                var buyer = await db.Buyers
                    .FirstOrDefaultAsync(buyer => buyer.UserId == buyerId);

                if (buyer == null)
                {
                    return Results.NotFound(new { message = "Buyer not found." });
                }

                return Results.Ok(ToProfile(buyer));
            });

            // Saves the Account details form
            app.MapPut("/api/buyers/{buyerId:int}", async (int buyerId, BuyerUpdateRequest req, AppDbContext db) =>
            {
                var buyer = await db.Buyers
                    .FirstOrDefaultAsync(buyer => buyer.UserId == buyerId);

                if (buyer == null)
                {
                    return Results.NotFound(new { message = "Buyer not found." });
                }

                // Registration saves emails in lower case, so match that here
                var email = req.Email.Trim().ToLower();

                // Buyers and dealers share the Users table, so check every other account
                if (await db.Users.AnyAsync(user => user.Email == email && user.UserId != buyerId))
                {
                    return Results.Conflict(new { message = $"{email} is already used by another account." });
                }

                buyer.FullName = StringFormatter.Capitalise(req.FullName.Trim());
                buyer.Email = email;
                buyer.PhoneNumber = req.PhoneNumber.Trim();
                buyer.Address = req.Address.Trim();

                await db.SaveChangesAsync();

                return Results.Ok(ToProfile(buyer));
            });
        }

        private static BuyerProfileResponse ToProfile(Buyer buyer)
        {
            return new BuyerProfileResponse(
                buyer.UserId,
                buyer.FullName,
                buyer.Email,
                buyer.PhoneNumber,
                buyer.Address,
                "Buyer",
                buyer.Balance
            );
        }
    }
}
