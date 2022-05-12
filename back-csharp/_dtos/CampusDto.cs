using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class CampusDto
{
    [JsonPropertyName("campus_id")]
    public int CampusId { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } 
    
    [JsonPropertyName("university_id")]
    public int UniversityId { get; set; } 
    
    [JsonPropertyName("university_name")]
    public string? UniversityName { get; set; } 
    
    [JsonPropertyName("state_name")]
    public string? StateName { get; set; } 
    
    [JsonPropertyName("state_id")]
    public int StateId { get; set; } 
    
    [JsonPropertyName("img_file")]
    public string? ImgFile { get; set; } 
    
    [JsonPropertyName("img_type")]
    public string? ImgType { get; set; }

    [JsonPropertyName("full_file_name")]
    public string? FullFileName { get; set; } = null;
}