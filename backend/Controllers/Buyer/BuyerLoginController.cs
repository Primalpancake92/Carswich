using backend.DAL;
using backend.DTO;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    // POST /api/buyers/login: checks the email and password of a buyer
    public static class BuyerLoginController
    {
        public static async Task<Results<Ok<BuyerLoginResponse>, BadRequest<BuyerErrorResponse>>> Login(
            LoginRequest req, AppDbContext db)
        {
            // Registration saves emails in lower case, so match that here
            var email = req.Email.Trim().ToLower();

            var buyer = await db.Buyers
                .FirstOrDefaultAsync(b => b.Email == email);

            if (buyer == null)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse("Buyer not found."));
            }

            if (buyer.Password != req.Password)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse("Incorrect password."));
            }

            return TypedResults.Ok(new BuyerLoginResponse(
                "Login successful.",
                buyer.UserId,
                buyer.FullName,
                buyer.Email,
                buyer.PhoneNumber,
                buyer.Address,
                "Buyer",
                buyer.Balance
            ));
        }
    }
}
