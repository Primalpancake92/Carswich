using System;

namespace models.User
{
    public abstract class User
    {
        private int _userId;
        private string _fullName;
        private string _password;
        private string _address;

        protected User()
        {
            _userId = 0;
            _fullName = "";
            _address = "";
            _password = "";
        }

        protected User(
            int userId, string fullName, string password, string address
        )
        {
            _userId = userId;
            _fullName = fullName;
            _password = password;
            _address = address;
        }

        public int getUserId()
        {
            return _userId;
        }

        public void setUserId(int userId)
        {
            _userId = userId;
        }

        public string getFullName()
        {
            return _fullName;
        }

        public void setFullName(string fullName)
        {
            _fullName = fullName;
        }

        public string getPassword()
        {
            return _password;
        }

        public void setPassword(string password)
        {
            _password = password;
        }

        public string getAddress()
        {
            return _address;
        }

        public void setAddress(string address)
        {
            _address = address;
        }
    }
}