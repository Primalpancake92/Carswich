using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.utils
{
    // Used by the buyer and dealer login routes
    public static class PasswordChecker
    {
        public static bool Matches(IPasswordHasher<User> hasher, User user, string password)
        {
            try
            {
                return hasher.VerifyHashedPassword(user, user.Password, password)
                    != PasswordVerificationResult.Failed;
            }
            catch (FormatException)
            {
                // The stored password isn't a hash (e.g. an account saved before
                // hashing was added), so it can never match
                return false;
            }
        }
    }
}
