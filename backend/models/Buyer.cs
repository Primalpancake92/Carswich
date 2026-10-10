using System;

namespace backend.models
{
    public class Buyer : User
    {
        private decimal _balance;
        public Buyer() : base() { }

        public Buyer(
            int userId, string fullName, string email, string password,
            string phoneNumber, string address, decimal balance
        ) : base (userId, fullName, email, password, phoneNumber, address)
        {
            _balance = balance;
        }

        public decimal GetBalance()
        {
            return _balance;
        }

        public bool Buy(Car car)
        {
            if (_balance < car.GetPrice())
            {
                Console.WriteLine("You do not have enough money to buy this car");
                return false;
            }

            if (car.GetQuantity() <= 0)
            {
                Console.WriteLine(
                    @"There is no stock for the {0} {1}",
                    car.GetMake(), car.GetModel()
                );
            }

            _balance -= car.GetPrice();
            car.DeductQuantity();
            
            Console.WriteLine(
                @"Car {0}, {1} has been bought",
                car.GetMake(), car.GetModel()
            );

            return true;
        }

        public override void ToString()
        {
            Console.WriteLine($"Buyer {GetUserId()}: balance {_balance}");
        }
    }
}
