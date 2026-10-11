using System.Data;
using backend.DAL;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.utils;

namespace backend.Controllers.Buyers
{
    [ApiController]
    [Route("api/buyers")]

    public class BuyerAuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BuyerAuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<ActionResult<BuyerRegisterErrResponse>> Register(BuyerRegisterRequest req)
        {
            var email = req.Email.ToLower().Trim();

            if (await _db.Users.AnyAsync(user => user.Email == email))
            {
                return Conflict(new BuyerRegisterErrResponse(
                    "Error",
                    $"User with {email} has been previously registered"
                ));
            }

            // Add email, phone number, address, and password and confirm password
            // verifier here in this class.

            var buyer = new Buyer {
                FullName = StringFormatter.Capitalise(req.FullName).Trim(),
                Email = email,
                PhoneNumber = req.PhoneNumber.Trim(),
                Address = req.Address.Trim(),
                Balance = 0
            };

            _db.Buyers.Add(buyer);
            await _db.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created,
                new BuyerRegisterSuccessResponse(
                    "Success",
                    new Dictionary<string, string>
                    {
                        ["userId"] = buyer.UserId.ToString(),
                        ["phoneNumber"] = buyer.PhoneNumber,
                        ["email"] = buyer.Email,
                        ["address"] = buyer.PhoneNumber
                    },
                    "Buyer has been created successfully."
                )
            );
        }
    }
}