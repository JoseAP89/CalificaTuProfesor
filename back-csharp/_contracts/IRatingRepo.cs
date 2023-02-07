using back_csharp._dtos;
using back_csharp._models;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<Comment> AddCommentAsync(CommentDTO commentDTO);
    Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId);
    Task<IEnumerable<FullCommentDTO>> GetCommentsByRosterAsync(int rosterId);
}
