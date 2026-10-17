using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.addCar
{
    public static class AddCarRoute
    {
        public static void MapAddCarRoute(this WebApplication app)
        {
            app.MapPost("/api/cars/add", async (CarCreateRequest req, AppDbContext db) =>
            {
                var dealer = await db.Dealers.FindAsync(req.DealerId);

                if (dealer == null)
                {
                    return Results.BadRequest(new { message = "Dealer not found." });
                }

                var car = new Car
                {
                    Make = req.Make,
                    Model = req.Model,
                    Year = req.Year,
                    Mileage = req.Mileage,
                    Colour = req.Colour,
                    Price = req.Price,
                    Description = req.Description,
                    DealerId = req.DealerId,
                    Quantity = 1,
                    IsSold = false
                };

                db.Cars.Add(car);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Car added successfully." });
            });
        }
    }
}


