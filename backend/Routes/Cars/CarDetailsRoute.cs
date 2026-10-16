using backend.DAL;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Cars
{
    public static class CarDetailsRoute
    {
        public static void MapCarDetailsRoute(this WebApplication app)
        {
            app.MapGet("/api/cars/{id:int}", async (int id, AppDbContext db) =>
            {
                var car = await db.Cars
                    .FirstOrDefaultAsync(car =>
                        car.CarId == id &&
                        !car.IsSold &&
                        car.Quantity > 0);
                
                if (car == null)
                {
                    return Results.NotFound(new
                    {
                        message = "Car not found or is no longer available."
                    });
                }

                return Results.Ok(car);
            });
        }
    }
}