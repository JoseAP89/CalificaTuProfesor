namespace back_csharp._dtos;

public class CommentDTO
{
    public int CommentId { get; set; }
    public string RecordId { get; set; }
    public int RosterId { get; set; }
    public string SubjectName { get; set; }
    public string Content { get; set; }
    public string UserId { get; set; }
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public IEnumerable<GradeDTO> Grades { get; set; }
    public IEnumerable<VoteDTO> Votes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ModifiedAt { get; set; }
}
