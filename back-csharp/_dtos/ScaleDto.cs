namespace back_csharp._dtos;
using System.Text.Json.Serialization;

public class ScaleDto
{
   [JsonPropertyName("scale_id")] 
   public int ScaleId { get; set; }
   public string Name { get; set; }
   public string Description { get; set; }
   
}