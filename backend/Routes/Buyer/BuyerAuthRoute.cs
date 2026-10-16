using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerAuthRoute
    {
        // Login: POST /api/buyers/login
        public static void MapBuyerAuthRoute(this WebApplication app)
        {
            app.MapPost("/api/buyers/login", async (
                BuyerLoginRequest req, AppDbContext db, IPasswordHasher<User> hasher) =>
            {
                var email = StringFormatter.NormaliseEmail(req.Email);
                var buyer = await db.Buyers.FirstOrDefaultAsync(b => b.Email == email);

                // Same message whether the email or the password is wrong,
                // so the response doesn't reveal which emails have accounts
                if (buyer is null || !PasswordChecker.Matches(hasher, buyer, req.Password))
                {
                    return Results.Json(
                        new BuyerErrorResponse("Incorrect email or password."),
                        statusCode: StatusCodes.Status401Unauthorized
                    );
                }

                return Results.Ok(BuyerResponse.FromBuyer("Logged in successfully.", buyer));
            });
        }
    }
}
