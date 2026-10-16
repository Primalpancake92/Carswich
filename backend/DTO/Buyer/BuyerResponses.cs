using backend.Models;

namespace backend.DTO
{
    // Sent back by register, login and update. Never includes the password.
    public record BuyerResponse(
        string Message,
        int UserId,
        string FullName,
        string Email,
        string PhoneNumber,
        string Address,
        string UserType,
        decimal Balance
    )
    {
        public static BuyerResponse FromBuyer(string message, Buyer buyer)
        {
            return new BuyerResponse(
                message,
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

    // Sent back by every buyer route when something goes wrong
    public record BuyerErrorResponse(
        string Message
    );
}
