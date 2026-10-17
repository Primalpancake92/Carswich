using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // This is the response for GET and PUT /api/dealers/{dealerId}
    public record DealerProfileResponse (
        int UserId,
        string FullName,
        string DealershipName,
        string Email,
        string PhoneNumber,
        string Address,
        string UserType,
        decimal Balance
    );

    // This is for the PUT /api/dealers/{dealerId} request (Account details form)
    public record DealerUpdateRequest (
        [Required, MaxLength(100)] string FullName,
        [Required, MaxLength(150)] string DealershipName,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(30)] string PhoneNumber,
        [Required, MaxLength(255)] string Address
    );
}
