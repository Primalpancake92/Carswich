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