using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public record BuyerDepositRequest (
        [Range(1, int.MaxValue)] int BuyerId,
        decimal Amount
    );
    
    public record BuyerDepositResponse (
        string Message,
        decimal Balance
    );
}
