namespace back_csharp._dtos;

public class StudyFieldDTO
{
    public int StudyFieldId { get; set; }
    public string Name { get; set; }
    public string Code { get; set; } = null!;
    public UniversityAreaDTO UniversityArea { get; set; }
}