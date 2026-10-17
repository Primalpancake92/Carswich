using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealer
{
    public static class DealerAuthRoute
    {
        public static void MapDealerAuthRoute(this WebApplication app)
        {
            app.MapPost("/api/dealers/login", async (DealerLoginRequest req, AppDbContext db) =>
            {
                // Dealer registration saves the email as typed, so compare both sides in lower case
                var email = req.Email.Trim().ToLower();

                var dealer = await db.Dealers
                    .FirstOrDefaultAsync(d => d.Email.ToLower() == email);

                if (dealer == null)
                {
                    return Results.BadRequest(new
                    {
                        message = "Dealer not found.",
                        dealerId = 0
                    });
                }

                if (dealer.Password != req.Password)
                {
                    return Results.BadRequest(new
                    {
                        message = "Incorrect password.",
                        dealerId = 0
                    });
                }

                // FIX: Return ALL dealer fields
                return Results.Ok(new DealerLoginResponse(
                    "Login successful.",
                    dealer.UserId,
                    dealer.FullName,
                    dealer.Email,
                    dealer.DealershipName
                ));

            });
        }
    }
}
