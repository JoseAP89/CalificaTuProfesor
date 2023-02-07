namespace back_csharp._dtos;

public class RosterRatingDTO
{
    public int RosterId { get; set; }
    public double AverageGrade { get; set; }
    public IEnumerable<GradeDTO> Grades { get; set; }
    
}
