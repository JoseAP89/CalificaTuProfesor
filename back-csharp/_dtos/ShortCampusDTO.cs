using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class ShortCampusDTO
{
    [JsonPropertyName("campus_id")]
    public int CampusId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("university_id")]
    public int UniversityId { get; set; }

    [JsonPropertyName("state_id")]
    public int StateId { get; set; }

}
