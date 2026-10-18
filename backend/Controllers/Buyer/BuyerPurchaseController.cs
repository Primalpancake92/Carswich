using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    public static class BuyerPurchaseController
    {
        public static async Task<Results<Created<BuyerPurchaseResponse>, NotFound<BuyerErrorResponse>, BadRequest<BuyerErrorResponse>>> BuyCar(
            BuyerPurchaseCar req, AppDbContext db)
        {
            var buyer = await db.Buyers
                .FirstOrDefaultAsync(buyer =>
                    buyer.UserId == req.BuyerId);

            if (buyer == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Buyer not found."));
            }

            var car = await db.Cars
                .FirstOrDefaultAsync(car =>
                    car.CarId == req.CarId);

            if (car == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Car not found."));
            }

            if (car.IsSold || car.Quantity <= 0)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse("This car is no longer available."));
            }

            if (buyer.Balance < car.Price)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse("Buyer does not have enough balance."));
            }

            if (car.DealerId == null)
            {
                return TypedResults.BadRequest(new BuyerErrorResponse("This car does not have a dealer."));
            }

            var dealer = await db.Dealers
                .FirstOrDefaultAsync (dealer =>
                    dealer.UserId == car.DealerId.Value);

            if (dealer == null)
            {
                return TypedResults.NotFound(new BuyerErrorResponse("Dealer not found."));
            }

            buyer.Balance -= car.Price;
            dealer.Balance += car.Price;

            car.DeductQuantity();

            if (car.Quantity == 0)
            {
                car.IsSold = true;
            }

            var purchase = new Purchase
            {
                Car = car,
                Buyer = buyer,
                Dealer = dealer,
                PaidAmount = car.Price,
                PurchaseDate = DateTime.UtcNow
            };

            buyer.Purchases.Add(purchase);
            dealer.Sales.Add(purchase);

            await db.SaveChangesAsync();

            return TypedResults.Created(
                $"/api/purchases/{purchase.PurchaseId}",
                new BuyerPurchaseResponse(
                    "Car purchased successfully.",
                    new PurchaseDetails(
                        purchase.PurchaseId,
                        purchase.CarId,
                        purchase.BuyerId,
                        purchase.DealerId,
                        purchase.PaidAmount,
                        purchase.PurchaseDate
                    ),
                    buyer.Balance,
                    car.Quantity
                ));
        }
    }
}
