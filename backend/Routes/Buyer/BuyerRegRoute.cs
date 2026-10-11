using backend.DAL;
using backend.DTO;
using backend.Models;
using backend.utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Routes.Buyers
{
    public static class BuyerRegRoute
    {
        public static void MapBuyerRegRoute(this WebApplication app)
        {
            app.MapPost("/api/buyers/register", async (BuyerRegisterRequest req, AppDbContext db) =>
            {
                var email = req.Email.Trim().ToLower();

                // Check every account (buyers and dealers share the Users table)
                if (await db.Users.AnyAsync(user => user.Email == email))
                {
                    return Results.Conflict(new BuyerRegisterErrResponse(
                        "Error",
                        $"User with {email} has been previously registered"
                    ));
                }

                var buyer = new Buyer
                {
                    FullName = StringFormatter.Capitalise(req.FullName.Trim()),
                    Email = email,
                    PhoneNumber = req.PhoneNumber.Trim(),
                    Address = req.Address.Trim(),
                    Password = req.Password,
                    Balance = 0
                };

                db.Buyers.Add(buyer);
                await db.SaveChangesAsync(); // save the changes asynchronously

                return Results.Created($"/api/buyers/{buyer.UserId}",
                    new BuyerRegisterSuccessResponse(
                        "Success",
                        new Dictionary<string, string>
                        {
                            ["userId"] = buyer.UserId.ToString(),
                            ["fullName"] = buyer.FullName,
                            ["email"] = buyer.Email,
                            ["phoneNumber"] = buyer.PhoneNumber,
                            ["address"] = buyer.Address
                        },
                        "Buyer has been created successfully."
                    ));
            });
        }
    }
}
