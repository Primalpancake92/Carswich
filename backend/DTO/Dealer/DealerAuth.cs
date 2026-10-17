using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // This is for the login API route
    public record DealerLoginRequest (
        [Required, EmailAddress, MaxLength(255)] string Email,
        [Required] string Password
    );

    // this is the response for the POST request of the API route
    public record DealerLoginResponse (
    string Message,
    int UserId,
    string FullName,
    string Email,
    string DealershipName
    );

}