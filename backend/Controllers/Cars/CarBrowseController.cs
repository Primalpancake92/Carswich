using backend.DAL;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Cars
{
    public static class CarBrowseController
    {
        public static async Task<Ok<List<Car>>> GetCars(AppDbContext db)
        {
            var cars = await db.Cars
                .Where(car => !car.IsSold && car.Quantity > 0)
                .OrderByDescending(car => car.Year)
                .ToListAsync();
            
            return TypedResults.Ok(cars);
        }
    }
}