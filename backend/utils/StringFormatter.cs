using System.Net.NetworkInformation;

namespace backend.utils
{
    public static class StringFormatter
    {
        public string Capitalise(string input)
        {
            string result;
            char firstChar = char.ToUpper(input[0]);

            result = firstChar + input.Substring(1);

            return result;
        }
    }
}
