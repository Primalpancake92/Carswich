using System;

namespace backend.Models
{
    public class Dealer : User
    {
        public string DealershipName { get; set; } = "";

        public decimal Balance { get; set; }

        // Note to self: This contains the list of cars the dealer can list.
        public List<Car> CarsAvailable { get; set; } = new List<Car>();
        public Dealer() : base() {}

        public Dealer(
            int userId, string fullName, string email, string password, 
            string phoneNumber, string address, string dealershipName, 
            decimal balance, List<Car> carsAvailable
        ) : base (userId, fullName, email, password, phoneNumber, address)
        {
            DealershipName = dealershipName;
            Balance = balance;
            CarsAvailable = carsAvailable;
        }

        public override void ToString()
        {
            throw new NotImplementedException();
        }
    }
}