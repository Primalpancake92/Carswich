using backend.Controllers.Buyers;

namespace backend.Routes.Buyers
{
    public static class BuyerRoutes
    {
        public static void MapBuyerRoutes(this WebApplication app)
        {
            app.MapPost("/api/buyers/register", BuyerRegisterController.Register);

            app.MapPost("/api/buyers/login", BuyerLoginController.Login);

            app.MapGet("/api/buyers/{buyerId:int}", BuyerGetProfileController.GetProfile);

            app.MapPut("/api/buyers/{buyerId:int}", BuyerUpdateProfileController.UpdateProfile);

            app.MapPost("/api/buyers/deposit", BuyerDepositController.Deposit);

            app.MapPost("/api/buy", BuyerPurchaseController.BuyCar);
        }
    }
}
