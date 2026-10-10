using System;

namespace backend.Models
{
    public class Buyer : User
    {
        public decimal Balance { get; set; }

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

        public override void ToString()
        {
            Console.WriteLine($"Buyer {UserId}: balance {Balance}");
        }
    }
}
