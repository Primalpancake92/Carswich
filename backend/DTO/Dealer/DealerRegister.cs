using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public record DealerRegisterRequest(
        [Required, MaxLength(100)] string FullName,
        [Required, Phone, MaxLength(30)] string PhoneNumber,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(255)] string Address,
        [Required, MinLength(8), MaxLength(50)] string Password,
        [Required, MaxLength(150)] string DealershipName
    );

    public record DealerRegisterResponse(
        int UserId,
        string FullName,
        string PhoneNumber,
        string Email,
        string Address,
        string Message
    );
}
