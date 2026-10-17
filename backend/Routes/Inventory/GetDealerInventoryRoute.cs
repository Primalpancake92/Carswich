using backend.DAL;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Inventory
{
    public static class GetDealerInventoryRoute
    {
        public static void MapGetDealerInventoryRoute(this WebApplication app)
        {
            app.MapGet("/api/inventory/dealer/{dealerId}", async (int dealerId, AppDbContext db) =>
            {
                var cars = await db.Cars
                    .Where(c => c.DealerId == dealerId)
                    .ToListAsync();

                return Results.Ok(cars);
            });
        }
    }
}
