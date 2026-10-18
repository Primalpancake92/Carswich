using backend.DAL;
using backend.DTO;
using backend.utils;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    // PUT /api/buyers/{buyerId}: saves the Account details form
    public static class BuyerUpdateProfileController
    {
        public static async Task<Results<Ok<BuyerProfileResponse>, NotFound<BuyerErrorResponse>, Conflict<BuyerErrorResponse>>> UpdateProfile(
            int buyerId, BuyerUpdateRequest req, AppDbContext db)
        {
            var buyer = await db.Buyers
                .FirstOrDefaultAsync(buyer => buyer.UserId == buyerId);

            if (buyer == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Buyer not found."));
            }

            // Registration saves emails in lower case, so match that here
            var email = req.Email.Trim().ToLower();

            // Buyers and dealers share the Users table, so check every other account
            if (await db.Users.AnyAsync(user => user.Email == email && user.UserId != buyerId))
            {
                return TypedResults.Conflict(new BuyerErrorResponse($"{email} is already used by another account."));
            }

            buyer.FullName = StringFormatter.Capitalise(req.FullName.Trim());
            buyer.Email = email;
            buyer.PhoneNumber = req.PhoneNumber.Trim();
            buyer.Address = req.Address.Trim();

            await db.SaveChangesAsync();

            return TypedResults.Ok(BuyerProfileMapper.ToProfile(buyer));
        }
    }
}
