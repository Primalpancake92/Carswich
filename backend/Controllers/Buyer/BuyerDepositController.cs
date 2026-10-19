using backend.DAL;
using backend.DTO;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    public static class BuyerDepositController
    {
        public static async Task<Results<Ok<BuyerDepositResponse>, NotFound<BuyerErrorResponse>, BadRequest<BuyerErrorResponse>>> Deposit(
            BuyerDepositRequest req, AppDbContext db)
        {
            var buyer = await db.Buyers
                .FirstOrDefaultAsync(buyer => buyer.UserId == req.BuyerId);

            if (buyer == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Buyer not found."));
            }

            try
            {
                buyer.BalanceDeposit(req.Amount);
            }
            catch (ArgumentException ex)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse(ex.Message));
            }

            await db.SaveChangesAsync();

            return TypedResults.Ok(new BuyerDepositResponse(
                "Deposit successful.",
                buyer.Balance
            ));
        }
    }
}
