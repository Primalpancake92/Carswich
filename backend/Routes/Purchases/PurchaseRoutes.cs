using backend.Controllers.Purchases;

namespace backend.Routes.Purchases
{
    public static class PurchaseRoutes
    {
        public static void MapPurchaseRoutes(this WebApplication app)
        {
            app.MapGet("/api/buyers/{buyerId:int}/purchases",
                PurchaseHistoryController.GetPurchaseHistory);
        }
    }
}