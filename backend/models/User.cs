using System;
using Microsoft.Extensions.Primitives;

namespace backend.models
{
    public abstract class User
    {
        private int _userId;
        private string _fullName;
        private string _email;
        private string _password;
        private string _phoneNumber;
        private string _address;

        protected User()
        {
            _userId = 0;
            _fullName = "";
            _email = "";
            _password = "";
            _phoneNumber = "";
            _address = "";
        }

        protected User(
            int userId, string fullName, string email, string password,
            string phoneNumber, string address
        )
        {
            _userId = userId;
            _fullName = fullName;
            _email = email;
            _password = password;
            _phoneNumber = phoneNumber;
            _address = address;
        }

        public int GetUserId()
        {
            return _userId;
        }

        public void SetUserId(int userId)
        {
            _userId = userId;
        }

        public string GetFullName()
        {
            return _fullName;
        }

        public void SetFullName(string fullName)
        {
            _fullName = fullName;
        }

        public string GetEmail()
        {
            return _email;
        }

        public void SetEmail(string email)
        {
            _email = email;
        }

        public string GetPassword()
        {
            return _password;
        }

        public void SetPassword(string password)
        {
            _password = password;
        }

        public string GetPhoneNumber()
        {
            return _phoneNumber;
        }

        public void SetPhoneNumber(string phoneNumber)
        {
            _phoneNumber = phoneNumber;
        }

        public string GetAddress()
        {
            return _address;
        }

        public void SetAddress(string address)
        {
            _address = address;
        }

        public abstract void ToString();
    }
}