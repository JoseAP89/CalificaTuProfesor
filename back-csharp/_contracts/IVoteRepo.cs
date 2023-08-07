using back_csharp._dtos;
using back_csharp._models;

namespace back_csharp._contracts;

public interface IVoteRepo
{
    Task<Vote> GetByUserAndCommentId(Guid userId, int commentId);
    Task<Vote> AddVote(VoteDTO voteDto);
}
