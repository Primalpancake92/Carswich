using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Dealer
{
    public static class DealerRegRoute
    {
        public static void MapDealerRegRoute(this WebApplication app)
        {
            app.MapPost("/api/dealers/register", async (DealerRegisterRequest req, AppDbContext db) =>
            {
                var exists = await db.Dealers.AnyAsync(d => d.Email == req.Email);
                if (exists)
                {
                    return Results.BadRequest(new DealerRegisterResponse(
                        0,
                        req.FullName,
                        req.PhoneNumber,
                        req.Email,
                        req.Address,
                        "Dealer already exists."
                    ));
                }

                var dealer = new backend.Models.Dealer
                {
                    FullName = req.FullName,
                    Email = req.Email,
                    PhoneNumber = req.PhoneNumber,
                    Address = req.Address,
                    Password = req.Password,
                    DealershipName = req.DealershipName,
                    Balance = 0
                };

                db.Dealers.Add(dealer);
                await db.SaveChangesAsync();

                return Results.Ok(new DealerRegisterResponse(
                    dealer.UserId,
                    dealer.FullName,
                    dealer.PhoneNumber,
                    dealer.Email,
                    dealer.Address,
                    "Dealer registered successfully."
                ));
            });
        }
    }
}

