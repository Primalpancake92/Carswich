namespace backend.DTO
{
    public record CarCreateRequest(
        string Make,
        string Model,
        int Year,
        int Mileage,
        string Colour,
        decimal Price,
        string Description,
        int DealerId
    );
}
