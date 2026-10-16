using System.Net.NetworkInformation;

namespace backend.utils
{
    public static class StringFormatter
    {
        public static string Capitalise(string input)
        {
            string result;
            char firstChar = char.ToUpper(input[0]);

            result = firstChar + input.Substring(1);

            return result;
        }

        // Emails are stored trimmed and lowercase, so "Alex@Example.com " and
        // "alex@example.com" count as the same account
        public static string NormaliseEmail(string email)
        {
            return email.Trim().ToLower();
        }
    }
}
