namespace back_csharp._dtos;

public class UniversityAreaDTO
{
    public int UniversityAreaId { get; set; }
    public string Name { get; set; }
    public string Code { get; set; } = null!;
    public List<StudyFieldDTO> StudyFields { get; set; }
}