using System;

namespace backend.Models
{
    public class Buyer : User
    {
        public decimal Balance { get; set; }

        // Every purchase this buyer has made (the other side is Purchase.Buyer)
        public List<Purchase> Purchases { get; set; } = new List<Purchase>();

        // The dealers this buyer has bought from, each listed once
        public IEnumerable<Dealer> Dealers => Purchases
            .Select(purchase => purchase.Dealer)
            .DistinctBy(dealer => dealer.UserId);

        public Buyer() : base() { }

        public Buyer(
            int userId, string fullName, string email, string password,
            string phoneNumber, string address, decimal balance
        ) : base (userId, fullName, email, password, phoneNumber, address)
        {
            Balance = balance;
        }

        // Same rule as Dealer.BalanceDeposit(): the amount must be greater than 0
        public void BalanceDeposit(decimal money)
        {
            if (money <= 0)
            {
                throw new ArgumentException("Deposit must be greater than 0");
            }

            Balance += money;
        }

        public override void PrintDetails()
        {
            Console.WriteLine($"Buyer {UserId}: balance {Balance}");
        }
    }
}
