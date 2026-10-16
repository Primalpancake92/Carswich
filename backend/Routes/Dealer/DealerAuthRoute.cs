using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealers
{
    public static class DealerAuthRoute
    {
        // Login: POST /api/dealers/login
        public static void MapDealerAuthRoute(this WebApplication app)
        {
            app.MapPost("/api/dealers/login", async (
                DealerLoginRequest req, AppDbContext db, IPasswordHasher<User> hasher) =>
            {
                var email = StringFormatter.NormaliseEmail(req.Email);
                var dealer = await db.Dealers.FirstOrDefaultAsync(d => d.Email == email);

                // Same message whether the email or the password is wrong,
                // so the response doesn't reveal which emails have accounts
                if (dealer is null || !PasswordChecker.Matches(hasher, dealer, req.Password))
                {
                    return Results.Json(
                        new DealerErrorResponse("Incorrect email or password."),
                        statusCode: StatusCodes.Status401Unauthorized
                    );
                }

                return Results.Ok(DealerResponse.FromDealer("Logged in successfully.", dealer));
            });
        }
    }
}
