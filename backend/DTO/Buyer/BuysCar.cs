using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    // This is for the POST /api/buy request
    public record BuyerPurchaseCar (
        [Range(1, int.MaxValue)] int BuyerId,
        [Range(1, int.MaxValue)] int CarId
    );

    // The purchase itself, with the same fields as the Purchase model
    public record PurchaseDetails (
        int PurchaseId,
        int CarId,
        int BuyerId,
        int DealerId,
        decimal PaidAmount,
        DateTime PurchaseDate
    );

    // This is the response for a successful purchase
    public record BuyerPurchaseResponse (
        string Message,
        PurchaseDetails Purchase,
        decimal BuyerBalance,
        int RemainingQuantity
    );
}
