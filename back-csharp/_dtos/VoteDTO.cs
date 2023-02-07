namespace back_csharp._dtos;

public class VoteDTO
{
    public int VoteId { get; set; }
    public int CommentId { get; set; }
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public bool? Approval { get; set; }
}
