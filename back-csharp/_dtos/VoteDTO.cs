namespace back_csharp._dtos;

public class VoteDTO
{
    public int VoteId { get; set; }
    public int CommentId { get; set; }
    public string UserId { get; set; }
    public bool? Approval { get; set; }
}
