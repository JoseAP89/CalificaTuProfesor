namespace back_csharp._dtos;

public class RankingDTO
{
    public Guid RosterRecordId { get; set; }
    public Guid CampusRecordId { get; set; }
    public string TeacherFullName { get; set; }
    public string CampusName { get; set; }
    public string StructureName { get; set; }
    public double Score { get; set; }
}
