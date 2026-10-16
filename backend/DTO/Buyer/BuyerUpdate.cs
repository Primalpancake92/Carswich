using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Body of PUT /api/buyers/{id}: replaces the buyer's account details.
    // Password and balance aren't changed here.
    public record BuyerUpdateRequest(
        [Required, MaxLength(100)] string FullName,
        [Required, Phone, MaxLength(30)] string PhoneNumber,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(255)] string Address
    );
}
