using backend.DAL;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealer
{
    public static class DealerListRoute
    {
        public static void MapDealerListRoute(this WebApplication app)
        {
            // Every dealership's id and name, so buyer pages can show who sells each car
            // (a car only stores its DealerId). Never sends passwords or balances.
            app.MapGet("/api/dealers", async (AppDbContext db) =>
            {
                var dealers = await db.Dealers
                    .OrderBy(dealer => dealer.DealershipName)
                    .Select(dealer => new
                    {
                        dealer.UserId,
                        dealer.DealershipName
                    })
                    .ToListAsync();

                return Results.Ok(dealers);
            });
        }
    }
}
