using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class CampusDto
{
    public int CampusId { get; set; }
    
    public string Name { get; set; } 
    
    public int UniversityId { get; set; } 
    
    public string UniversityName { get; set; } 
    
    public string StateName { get; set; } 
    
    public int StateId { get; set; } 
    
    public string ImgFile { get; set; } 
    
    public string ImgType { get; set; }

    public string FullFileName { get; set; } = null;
}