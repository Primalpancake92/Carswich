using backend.DAL;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Purchases
{
    public static class PurchaseHistoryRoute
    {
        public static void MapPurchaseHistoryRoute(this WebApplication app)
        {
            app.MapGet("/api/buyers/{buyerId:int}/purchases",
                async (int buyerId, AppDbContext db) =>
                {
                    var buyerExists = await db.Buyers
                        .AnyAsync(buyer => buyer.UserId == buyerId);

                    if (!buyerExists)
                    {
                        return Results.NotFound(new
                        {
                            message = "Buyer not found."
                        });
                    }

                    var purchases = await (
                        from purchase in db.Purchases
                        join car in db.Cars
                            on purchase.CarId equals car.CarId
                        join dealer in db.Dealers
                            on purchase.DealerId equals dealer.UserId

                        where purchase.BuyerId == buyerId

                        orderby purchase.PurchaseDate descending

                        select new
                        {
                            purchase.PurchaseId,
                            purchase.PaidAmount,
                            purchase.PurchaseDate,

                            Car = new
                            {
                                car.CarId,
                                car.Make,
                                car.Model,
                                car.Year,
                                car.Mileage,
                                car.Colour
                            },

                            Dealer = new
                            {
                                dealer.UserId,
                                dealer.DealershipName
                            }
                        }
                    ).ToListAsync();

                    return Results.Ok(purchases);
                });
        }
    }
}