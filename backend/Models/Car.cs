namespace backend.Models
{
    public class Car
    {
        public int CarId { get; set; }
        public int DealerId { get; set; }
        public string Make { get; set; } = "";
        public string Model { get; set; } = "";
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string Colour { get; set; } = "";
        public decimal Price { get; set; }
        public string Description { get; set; } = "";
        public int Quantity { get; set; }
        public bool IsSold { get; set; }

        public Car() { }

        public Car(
            int carId, int dealerId, string make, string model, int year,
            int mileage, string colour, decimal price, string description,
            bool isSold
        )
        {
            CarId = carId;
            DealerId = dealerId;
            Make = make;
            Model = model;
            Year = year;
            Mileage = mileage;
            Colour = colour;
            Price = price;
            Description = description;
            IsSold = isSold;
        }

        public void DeductQuantity()
        {
            Quantity--;
        }

        public void AddQuantity()
        {
            Quantity++;
        }
    }
}
