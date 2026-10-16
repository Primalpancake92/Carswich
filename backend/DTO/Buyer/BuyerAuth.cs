using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Body of POST /api/buyers/login
    public record BuyerLoginRequest (
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required] string Password
    );
}
