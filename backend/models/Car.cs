namespace backend.models
{
    public class Car
    {
        private int _carId;
        private int _dealerId;
        private string _make;
        private string _model;
        private int _year;
        private int _mileage;
        private string _colour;
        private decimal _price;
        private string _description;
        private bool _isSold;

        public Car()
        {
            _carId = 0;
            _dealerId = 0;
            _make = "";
            _model = "";
            _year = 0;
            _mileage = 0;
            _colour = "";
            _price = 0;
            _description = "";
            _isSold = false;
        }

        public Car(
            int carId, int dealerId, string make, string model, int year,
            int mileage, string colour, decimal price, string description,
            bool isSold
        )
        {
            _carId = carId;
            _dealerId = dealerId;
            _make = make;
            _model = model;
            _year = year;
            _mileage = mileage;
            _colour = colour;
            _price = price;
            _description = description;
            _isSold = isSold;
        }

        public int GetCarId()
        {
            return _carId;
        }

        public void SetCarId(int carId)
        {
            _carId = carId;
        }

        public int GetDealerId()
        {
            return _dealerId;
        }

        public void SetDealerId(int dealerId)
        {
            _dealerId = dealerId;
        }

        public string GetMake()
        {
            return _make;
        }

        public void SetMake(string make)
        {
            _make = make;
        }

        public string GetModel()
        {
            return _model;
        }

        public void SetModel(string model)
        {
            _model = model;
        }

        public int GetYear()
        {
            return _year;
        }

        public void SetYear(int year)
        {
            _year = year;
        }

        public int GetMileage()
        {
            return _mileage;
        }

        public void SetMileage(int mileage)
        {
            _mileage = mileage;
        }

        public string GetColour()
        {
            return _colour;
        }

        public void SetColour(string colour)
        {
            _colour = colour;
        }

        public decimal GetPrice()
        {
            return _price;
        }

        public void SetPrice(decimal price)
        {
            _price = price;
        }

        public string GetDescription()
        {
            return _description;
        }

        public void SetDescription(string description)
        {
            _description = description;
        }

        public bool GetIsSold()
        {
            return _isSold;
        }

        public void SetIsSold(bool isSold)
        {
            _isSold = isSold;
        }
    }
}
