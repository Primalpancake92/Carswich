using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public record BuyerPurchaseCar (
        [Range(1, int.MaxValue)] int BuyerId,
        [Range(1, int.MaxValue)] int CarId
    );
}