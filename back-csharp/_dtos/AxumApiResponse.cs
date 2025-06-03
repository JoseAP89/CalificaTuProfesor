using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class AxumApiResponse
{
    public string Message { get; set; }

    [JsonPropertyName("is_inappropiate")]
    public bool? IsInappropiate { get; set; }
}
