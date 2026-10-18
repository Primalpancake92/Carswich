using backend.DTO;
using backend.Models;

namespace backend.Controllers.Buyers
{
    // Turns a Buyer model into the profile JSON sent to the frontend.
    // Shared by the get and update profile controllers so both send the same shape.
    public static class BuyerProfileMapper
    {
        public static BuyerProfileResponse ToProfile(Buyer buyer)
        {
            return new BuyerProfileResponse(
                buyer.UserId,
                buyer.FullName,
                buyer.Email,
                buyer.PhoneNumber,
                buyer.Address,
                "Buyer",
                buyer.Balance
            );
        }
    }
}
