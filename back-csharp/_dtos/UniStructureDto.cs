using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class UniStructureDto
{
    [JsonPropertyName("uni_structure_id")]
    public int UniStructureId { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; } 
}