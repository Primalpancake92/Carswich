using backend.DAL;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerDepositRoute
    {
        public static void MapBuyerDepositRoute(this WebApplication app)
        {
            // Adds money to the buyer's balance (Wallet tab on the Account page)
            app.MapPost("/api/buyers/deposit", async (BuyerDepositRequest req, AppDbContext db) =>
            {
                var buyer = await db.Buyers
                    .FirstOrDefaultAsync(buyer => buyer.UserId == req.BuyerId);

                if (buyer == null)
                {
                    return Results.NotFound(new { message = "Buyer not found." });
                }

                try
                {
                    buyer.BalanceDeposit(req.Amount);
                }
                catch (ArgumentException ex)
                {
                    return Results.BadRequest(new { message = ex.Message });
                }

                await db.SaveChangesAsync();

                return Results.Ok(new BuyerDepositResponse(
                    "Deposit successful.",
                    buyer.Balance
                ));
            });
        }
    }
}
