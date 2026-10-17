using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerAuthRoute
    {
        public static void MapBuyerAuthRoute(this WebApplication app)
        {
            app.MapPost("/api/buyers/login", async (LoginRequest req, AppDbContext db) =>
            {
                // Registration saves emails in lower case, so match that here
                var email = req.Email.Trim().ToLower();

                var buyer = await db.Buyers
                    .FirstOrDefaultAsync(b => b.Email == email);

                if (buyer == null)
                {
                    return Results.BadRequest(new { message = "Buyer not found." });
                }

                if (buyer.Password != req.Password)
                {
                    return Results.BadRequest(new { message = "Incorrect password." });
                }

                return Results.Ok(new BuyerLoginResponse(
                    "Login successful.",
                    buyer.UserId,
                    buyer.FullName,
                    buyer.Email,
                    buyer.PhoneNumber,
                    buyer.Address,
                    "Buyer",
                    buyer.Balance
                ));
            });
        }
    }
}
