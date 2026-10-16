using backend.DAL;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealers
{
    public static class DealerDeleteRoute
    {
        // Delete: DELETE /api/dealers/{id}
        public static void MapDealerDeleteRoute(this WebApplication app)
        {
            app.MapDelete("/api/dealers/{id:int}", async (int id, AppDbContext db) =>
            {
                var dealer = await db.Dealers.FindAsync(id);

                if (dealer is null)
                {
                    return Results.NotFound(new DealerErrorResponse($"Dealer {id} does not exist"));
                }

                // Purchases keep a record of who sold each car (DeleteBehavior.Restrict
                // in AppDbContext), so a dealer with sales history can't be removed
                if (await db.Purchases.AnyAsync(purchase => purchase.DealerId == id))
                {
                    return Results.Conflict(new DealerErrorResponse(
                        "Dealers with sales history can't be deleted"
                    ));
                }

                // The dealer's car listings are deleted with them (DeleteBehavior.Cascade)
                db.Dealers.Remove(dealer);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
