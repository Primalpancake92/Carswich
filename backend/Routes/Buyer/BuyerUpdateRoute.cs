using backend.DAL;
using backend.DTO;
using backend.utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerUpdateRoute
    {
        // Update: PUT /api/buyers/{id}
        public static void MapBuyerUpdateRoute(this WebApplication app)
        {
            app.MapPut("/api/buyers/{id:int}", async (
                int id, BuyerUpdateRequest req, AppDbContext db) =>
            {
                var buyer = await db.Buyers.FindAsync(id);

                if (buyer is null)
                {
                    return Results.NotFound(new BuyerErrorResponse($"Buyer {id} does not exist"));
                }

                var email = StringFormatter.NormaliseEmail(req.Email);

                // A changed email must not already belong to another account
                if (email != buyer.Email && await db.Users.AnyAsync(user => user.Email == email))
                {
                    return Results.Conflict(new BuyerErrorResponse(
                        $"User with {email} has been previously registered"
                    ));
                }

                buyer.FullName = StringFormatter.Capitalise(req.FullName.Trim());
                buyer.Email = email;
                buyer.PhoneNumber = req.PhoneNumber.Trim();
                buyer.Address = req.Address.Trim();

                // EF Core tracks the buyer it loaded, so saving writes the changed fields
                await db.SaveChangesAsync();

                return Results.Ok(BuyerResponse.FromBuyer("Buyer has been updated successfully.", buyer));
            });
        }
    }
}
