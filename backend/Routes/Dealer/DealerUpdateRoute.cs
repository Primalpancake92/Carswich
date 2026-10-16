using backend.DAL;
using backend.DTO;
using backend.utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealers
{
    public static class DealerUpdateRoute
    {
        // Update: PUT /api/dealers/{id}
        public static void MapDealerUpdateRoute(this WebApplication app)
        {
            app.MapPut("/api/dealers/{id:int}", async (
                int id, DealerUpdateRequest req, AppDbContext db) =>
            {
                var dealer = await db.Dealers.FindAsync(id);

                if (dealer is null)
                {
                    return Results.NotFound(new DealerErrorResponse($"Dealer {id} does not exist"));
                }

                var email = StringFormatter.NormaliseEmail(req.Email);

                // A changed email must not already belong to another account
                if (email != dealer.Email && await db.Users.AnyAsync(user => user.Email == email))
                {
                    return Results.Conflict(new DealerErrorResponse(
                        $"User with {email} has been previously registered"
                    ));
                }

                dealer.FullName = StringFormatter.Capitalise(req.FullName.Trim());
                dealer.Email = email;
                dealer.PhoneNumber = req.PhoneNumber.Trim();
                dealer.Address = req.Address.Trim();
                dealer.DealershipName = req.DealershipName.Trim();

                // EF Core tracks the dealer it loaded, so saving writes the changed fields
                await db.SaveChangesAsync();

                return Results.Ok(DealerResponse.FromDealer("Dealer has been updated successfully.", dealer));
            });
        }
    }
}
