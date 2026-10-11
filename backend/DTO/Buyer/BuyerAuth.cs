using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public record LoginRequest (
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required] string Password
    );

    public record BuyerLoginResponse (
        string Message,
        int UserId,
        string FullName,
        string Email,
        string PhoneNumber,
        string Address,
        string UserType,
        decimal Balance
    );
}