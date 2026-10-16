using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Body of POST /api/buyers/register
    public record BuyerRegisterRequest(
        [Required, MaxLength(100)] string FullName,
        [Required, Phone, MaxLength(30)] string PhoneNumber,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(255)] string Address,
        [Required, MinLength(8), MaxLength(50)] string Password
    );
}
