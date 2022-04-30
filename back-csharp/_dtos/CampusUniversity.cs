using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class CampusUniversity
{
    [JsonPropertyName("campus_id")]
    public int CampusId { get; set; }
    public string Name { get; set; }
    public UniversityDto University { get; set; }
}