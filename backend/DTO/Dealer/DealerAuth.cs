using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // Body of POST /api/dealers/login
    public record DealerLoginRequest (
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required] string Password
    );
}
