using System;

namespace backend.Models
{
    public class Dealer : User
    {
        public string DealershipName { get; set; } = "";

        public decimal Balance { get; set; }

        // Note to self: This contains the list of cars the dealer can list.
        public List<Car> CarsAvailable { get; set; } = new List<Car>();

        // Every sale this dealer has made (the other side is Purchase.Dealer)
        public List<Purchase> Sales { get; set; } = new List<Purchase>();

        // The buyers who have bought from this dealer, each listed once
        public IEnumerable<Buyer> Buyers => Sales
            .Select(sale => sale.Buyer)
            .DistinctBy(buyer => buyer.UserId);

        public Dealer() : base() {}

        public Dealer(
            int userId, string fullName, string email, string password, 
            string phoneNumber, string address, string dealershipName, 
            decimal balance
        ) : base (userId, fullName, email, password, phoneNumber, address)
        {
            DealershipName = dealershipName;
            Balance = balance;
        }

        public void BalanceDeposit(decimal money)
        {
            if (money <= 0)
            {
                Console.WriteLine("Invalid balance");
                throw new ArgumentException("Balance must be greater than 0");
            }

            Balance += money;
        }

        public List<Car> GetAvailableCars()
        {
            List<Car> carsAvailable = new List<Car>();

            throw new NotImplementedException("To be implemented");
        }

        public bool OwnsThisCar(Car car)
        {
            return car.DealerId == 0;
        }

        public override void PrintDetails()
        {
            throw new NotImplementedException();
        }
    }
}