using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealers
{
    public static class DealerRegRoute
    {
        // Create: POST /api/dealers/register
        public static void MapDealerRegRoute(this WebApplication app)
        {
            app.MapPost("/api/dealers/register", async (
                DealerRegisterRequest req, AppDbContext db, IPasswordHasher<User> hasher) =>
            {
                var email = StringFormatter.NormaliseEmail(req.Email);

                // Check every account (buyers and dealers share the Users table)
                if (await db.Users.AnyAsync(user => user.Email == email))
                {
                    return Results.Conflict(new DealerErrorResponse(
                        $"User with {email} has been previously registered"
                    ));
                }

                var dealer = new Dealer
                {
                    FullName = StringFormatter.Capitalise(req.FullName.Trim()),
                    Email = email,
                    PhoneNumber = req.PhoneNumber.Trim(),
                    Address = req.Address.Trim(),
                    DealershipName = req.DealershipName.Trim(),
                    Balance = 0
                };

                // Store a salted hash, never the password itself
                dealer.Password = hasher.HashPassword(dealer, req.Password);

                db.Dealers.Add(dealer);
                await db.SaveChangesAsync();

                return Results.Created($"/api/dealers/{dealer.UserId}",
                    DealerResponse.FromDealer("Dealer has been created successfully.", dealer));
            });
        }
    }
}
