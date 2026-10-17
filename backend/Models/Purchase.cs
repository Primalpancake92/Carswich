using System;

namespace backend.Models
{
    public class Purchase
    {
        public int PurchaseId { get; set; }
        public int CarId { get; set; }
        public int BuyerId { get; set; }
        public int DealerId { get; set; }
        public decimal PaidAmount { get; set; }
        public DateTime PurchaseDate { get; set; }

        // Navigation properties: EF Core fills these from the foreign keys above,
        // so a purchase can reach the car, the buyer and the dealer it links.
        public Car Car { get; set; } = null!;
        public Buyer Buyer { get; set; } = null!;
        public Dealer Dealer { get; set; } = null!;

        public Purchase () {}

        public Purchase (
            int purchaseId, int carId, int buyerId, int dealerId, 
            decimal paidAmount, DateTime purchaseDate
        )
        {
            PurchaseId = purchaseId;
            CarId = carId;
            BuyerId = buyerId;
            DealerId = dealerId;
            PaidAmount = paidAmount;
            PurchaseDate = purchaseDate;
        }
    }
}