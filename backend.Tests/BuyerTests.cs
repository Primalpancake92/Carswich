using backend.Models;
using NUnit.Framework;

namespace backend.Tests
{
    [TestFixture]
    public class BuyerTests
    {
        private Buyer buyer;
        private Car car;

        [SetUp]
        public void Setup()
        {
            buyer = new Buyer
            {
                UserId = 1,
                FullName = "Test Buyer",
                Balance = 10000
            };

            car = new Car
            {
                CarId = 1,
                Make = "Toyota",
                Model = "Corolla",
                Price = 20000,
                Quantity = 1,
                IsSold = false
            };
        }

        [Test]
        public void Buy_ReturnsFalse_WhenBuyerDoesNotHaveEnoughMoney()
        {
            // Arrange
            // Buyer has $10000, car costs $20000

            // Act
            bool result = buyer.Buy(car);

            // Assert
            Assert.That(result, Is.False);
            Assert.That(buyer.Balance, Is.EqualTo(10000));
            Assert.That(car.Quantity, Is.EqualTo(1));
        }

        [Test]
        public void Buy_ReturnsTrue_WhenBuyerHasEnoughMoneyAndCarIsInStock()
        {
            // Arrange
            buyer.Balance = 30000;
            car.Price = 20000;
            car.Quantity = 1;

            // Act
            bool result = buyer.Buy(car);

            // Assert
            Assert.That(result, Is.True);
            Assert.That(buyer.Balance, Is.EqualTo(10000));
            Assert.That(car.Quantity, Is.EqualTo(0));
        }
    }
}