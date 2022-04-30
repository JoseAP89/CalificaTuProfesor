using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class UniversityDto
{
    public int UniversityId { get; set; }
    public string Name { get; set; } = null!;
    [JsonPropertyName("img_file")]
    public string ImgFile { get; set; } = null!;
}