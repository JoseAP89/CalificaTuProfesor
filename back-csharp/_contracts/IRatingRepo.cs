using back_csharp._dtos;
using back_csharp._models;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<Comment> AddComment(CommentDTO commentDTO);
    Task<RosterRatingDTO> GetRosterRatingInfo(int rosterId);
}
