using backend.DAL;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerDeleteRoute
    {
        // Delete: DELETE /api/buyers/{id}
        public static void MapBuyerDeleteRoute(this WebApplication app)
        {
            app.MapDelete("/api/buyers/{id:int}", async (int id, AppDbContext db) =>
            {
                var buyer = await db.Buyers.FindAsync(id);

                if (buyer is null)
                {
                    return Results.NotFound(new BuyerErrorResponse($"Buyer {id} does not exist"));
                }

                // Purchases keep a record of who bought each car (DeleteBehavior.Restrict
                // in AppDbContext), so a buyer with purchase history can't be removed
                if (await db.Purchases.AnyAsync(purchase => purchase.BuyerId == id))
                {
                    return Results.Conflict(new BuyerErrorResponse(
                        "Buyers with purchase history can't be deleted"
                    ));
                }

                db.Buyers.Remove(buyer);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
