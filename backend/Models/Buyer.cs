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

        public bool Buy(Car car)
        {
            if (Balance < car.Price)
            {
                Console.WriteLine("You do not have enough money to buy this car");
                return false;
            }

            if (car.Quantity <= 0)
            {
                Console.WriteLine(
                    @"There is no stock for the {0} {1}",
                    car.Make, car.Model
                );
            }

            Balance -= car.Price;
            car.DeductQuantity();

            Console.WriteLine(
                @"Car {0}, {1} has been bought",
                car.Make, car.Model
            );

            return true;
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
