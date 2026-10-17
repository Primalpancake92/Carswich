using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // This is for the POST /api/buyers/deposit request
    public record BuyerDepositRequest (
        [Range(1, int.MaxValue)] int BuyerId,
        decimal Amount
    );

    // This is the response for a successful deposit, with the new balance
    public record BuyerDepositResponse (
        string Message,
        decimal Balance
    );
}
