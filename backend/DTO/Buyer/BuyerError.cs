namespace backend.DTO
{
    // This is the error response for the buyer endpoints, sent as { "message": "..." }
    public record BuyerErrorResponse (
        string Message
    );
}
