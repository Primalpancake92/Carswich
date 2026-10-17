using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // This is the response for GET and PUT /api/buyers/{buyerId}
    public record BuyerProfileResponse (
        int UserId,
        string FullName,
        string Email,
        string PhoneNumber,
        string Address,
        string UserType,
        decimal Balance
    );

    // This is for the PUT /api/buyers/{buyerId} request (Account details form)
    public record BuyerUpdateRequest (
        [Required, MaxLength(100)] string FullName,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(20)] string PhoneNumber,
        [Required, MaxLength(255)] string Address
    );
}
