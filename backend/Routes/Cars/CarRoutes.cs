using backend.Controllers.Cars;

namespace backend.Routes.Cars
{
    public static class CarRoutes
    {
        public static void MapCarRoutes(this WebApplication app)
        {
            app.MapGet("/api/cars", CarBrowseController.GetCars);

            app.MapGet("/api/cars/{id:int}", CarDetailsController.GetCar);
        }
    }
}