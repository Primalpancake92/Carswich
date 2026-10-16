using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Body of PUT /api/dealers/{id}: replaces the dealer's account details.
    // Password and balance aren't changed here.
    public record DealerUpdateRequest(
        [Required, MaxLength(100)] string FullName,
        [Required, Phone, MaxLength(30)] string PhoneNumber,
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required, MaxLength(255)] string Address,
        [Required, MaxLength(150)] string DealershipName
    );
}
