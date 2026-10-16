using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerRegRoute
    {
        // Create: POST /api/buyers/register
        public static void MapBuyerRegRoute(this WebApplication app)
        {
            app.MapPost("/api/buyers/register", async (
                BuyerRegisterRequest req, AppDbContext db, IPasswordHasher<User> hasher) =>
            {
                var email = StringFormatter.NormaliseEmail(req.Email);

                // Check every account (buyers and dealers share the Users table)
                if (await db.Users.AnyAsync(user => user.Email == email))
                {
                    return Results.Conflict(new BuyerErrorResponse(
                        $"User with {email} has been previously registered"
                    ));
                }

                var buyer = new Buyer
                {
                    FullName = StringFormatter.Capitalise(req.FullName.Trim()),
                    Email = email,
                    PhoneNumber = req.PhoneNumber.Trim(),
                    Address = req.Address.Trim(),
                    Balance = 0
                };

                // Store a salted hash, never the password itself
                buyer.Password = hasher.HashPassword(buyer, req.Password);

                db.Buyers.Add(buyer);
                await db.SaveChangesAsync(); // save the changes asynchronously

                return Results.Created($"/api/buyers/{buyer.UserId}",
                    BuyerResponse.FromBuyer("Buyer has been created successfully.", buyer));
            });
        }
    }
}
