using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Buyers
{
    public static class Buy
    {
        public static void MapBuyerPurchaseRoute(this WebApplication app)
        {
            app.MapPost("/api/buy", async (
                BuyerPurchaseCar req,
                AppDbContext db) =>
            {
                var buyer = await db.Buyers
                    .FirstOrDefaultAsync(buyer =>
                        buyer.UserId == req.BuyerId);
                
                if (buyer == null)
                {
                    return Results.NotFound(new
                    {
                        message = "Buyer not found."
                    });
                }

                var car = await db.Cars
                    .FirstOrDefaultAsync(car =>
                        car.CarId == req.CarId);
                
                if (car == null)
                {
                    return Results.NotFound(new
                    {
                        message = "Car not found."
                    });
                }

                if (car.IsSold || car.Quantity <= 0)
                {
                    return Results.BadRequest(new
                    {
                        message = "This car is no longer available."
                    });
                }

                if (buyer.Balance < car.Price)
                {
                    return Results.BadRequest(new
                    {
                        message = "Buyer does not have enough balance."
                    });
                }

                if (car.DealerId == null)
                {
                    return Results.BadRequest(new
                    {
                        message = "This car does not have a dealer."
                    });
                }

                var dealer = await db.Dealers
                    .FirstOrDefaultAsync (dealer =>
                        dealer.UserId == car.DealerId.Value);
                
                if (dealer == null)
                {
                    return Results.NotFound(new
                    {
                        message = "Dealer not found."
                    });
                }

                buyer.Balance -= car.Price;
                dealer.Balance += car.Price;

                car.DeductQuantity();

                if (car.Quantity == 0)
                {
                    car.IsSold = true;
                }

                // Setting the navigation properties lets EF Core fill in
                // CarId, BuyerId and DealerId when it saves
                var purchase = new Purchase
                {
                    Car = car,
                    Buyer = buyer,
                    Dealer = dealer,
                    PaidAmount = car.Price,
                    PurchaseDate = DateTime.UtcNow
                };

                // Link the purchase to both sides of the relationship
                buyer.Purchases.Add(purchase);
                dealer.Sales.Add(purchase);

                // Saves the balances, the car stock and the new purchase together
                await db.SaveChangesAsync();

                return Results.Created(
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
            });
        }
    }
}