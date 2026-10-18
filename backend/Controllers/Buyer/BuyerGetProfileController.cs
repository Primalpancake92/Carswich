using backend.DAL;
using backend.DTO;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    public static class BuyerGetProfileController
    {
        public static async Task<Results<Ok<BuyerProfileResponse>, NotFound<BuyerErrorResponse>>> GetProfile(
            int buyerId, AppDbContext db)
        {
            var buyer = await db.Buyers
                .FirstOrDefaultAsync(buyer => buyer.UserId == buyerId);

            if (buyer == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Buyer not found."));
            }

            return TypedResults.Ok(BuyerProfileMapper.ToProfile(buyer));
        }
    }
}
