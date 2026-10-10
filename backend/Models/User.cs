using System;
using Microsoft.Extensions.Primitives;

namespace backend.Models
{
    public abstract class User
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string Address { get; set; } = "";

        protected User() { }

        protected User(
            int userId, string fullName, string email, string password,
            string phoneNumber, string address
        )
        {
            UserId = userId;
            FullName = fullName;
            Email = email;
            Password = password;
            PhoneNumber = phoneNumber;
            Address = address;
        }

        public abstract void ToString();
    }
}
