namespace back_csharp._dtos;

public class CommentDTO
{
    public int CommentId { get; set; }
    public string RecordId { get; set; }
    public int RosterId { get; set; }
    public string SubjectName { get; set; }
    public string Content { get; set; }
    public string TokenId { get; set; }
    public IEnumerable<GradeDTO> Grades { get; set; }
    public VoteDTO Vote { get; set; }
}
