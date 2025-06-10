namespace back_csharp._dtos;

public class CampusTeacherListDTO
{
    public string TeacherRecordId { get; set; }
    public string Name { get; set; }
    public string FirstLastName { get; set; }
    public string SecondLastName { get; set; }
    public int TotalComments { get; set; }
    public double AverageGrade { get; set; }
    public double AverageDifficulty { get; set; }
    public int CampusId { get; set; }
    public string CampusName { get; set; }
    public int Rank { get; set; }
    public string CampusRecordId { get; set; }
    public string RosterRecordId { get; set; }
}

