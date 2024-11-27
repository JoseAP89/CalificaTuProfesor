using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._models;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<Comment> AddCommentAsync(CommentDTO commentDTO);
    Task<Comment> EditCommentContentAsync(CommentContentDTO commentDTO);
    Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId);
    Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0, Guid? currentUserId = null);
}
