using System.Reflection.Metadata.Ecma335;
using backend.DAL;
using backend.Models;
using backend.Routes.Cars;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Cars
{
    public static class CarDetailsController
    {
        public static async Task<Results<Ok<Car>, NotFound<object>>> GetCar(
            int id, AppDbContext db)
        {
            var car = await db.Cars
                .FirstOrDefaultAsync(car =>
                    car.CarId == id &&
                    !car.IsSold &&
                    car.Quantity > 0);
            
            if (car == null)
            {
                return TypedResults.NotFound<object>(new
                {
                    message = "Car not found or is no longer available."
                });
            }
            return TypedResults.Ok(car);
        }
    }
}