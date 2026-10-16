using backend.Models;

namespace backend.DTO
{
    // Sent back by register, login and update. Never includes the password.
    public record DealerResponse(
        string Message,
        int UserId,
        string FullName,
        string Email,
        string PhoneNumber,
        string Address,
        string DealershipName,
        string UserType,
        decimal Balance
    )
    {
        public static DealerResponse FromDealer(string message, Dealer dealer)
        {
            return new DealerResponse(
                message,
                dealer.UserId,
                dealer.FullName,
                dealer.Email,
                dealer.PhoneNumber,
                dealer.Address,
                dealer.DealershipName,
                "Dealer",
                dealer.Balance
            );
        }
    }

    // Sent back by every dealer route when something goes wrong
    public record DealerErrorResponse(
        string Message
    );
}
