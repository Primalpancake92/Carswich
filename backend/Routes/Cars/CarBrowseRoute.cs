using backend.DAL;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Cars
{
    public static class CarBrowseRoute
    {
        public static void MapCarBrowseRoute(this WebApplication app)
        {
            app.MapGet("/api/cars", async (AppDbContext db) =>
            {
                var cars = await db.Cars
                    .Where(car => !car.IsSold && car.Quantity > 0)
                    .OrderByDescending(car => car.Year)
                    .ToListAsync();
                
                return Results.Ok(cars);
            });
        }
    }
}