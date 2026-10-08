using System;

namespace backend.models
{
    public class Buyer : User
    {
        private float _balance;
        public Buyer() : base() { }
        
        public Buyer(
            int userId, string fullName, string email, string password, 
            string phoneNumber, string address, int balance
        ) : base (userId, fullName, email, password, phoneNumber, address) 
        {
            
        }
    }
}