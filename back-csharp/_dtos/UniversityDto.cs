using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class UniversityDto
{
    [JsonPropertyName("university_id")]
    public int UniversityId { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("img_file")]
    public string? ImgFile { get; set; }
    [JsonPropertyName("img_type")]
    public string? ImgType { get; set; }
}