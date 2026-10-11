using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public record BuyerRegisterRequest(
        [Required, MaxLength(100)] string FullName,
        [Required, MaxLength(10)] string PhoneNumber,
        [Required, MaxLength(255)] string Email,
        [Required, MaxLength(255)] string Address,
        [Required, MinLength(8), MaxLength(50)] string Password
    );

    public record BuyerRegisterResponse(
        int UserId,
        string Message
    );
}