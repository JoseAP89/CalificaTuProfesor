using back_csharp._dtos;
using back_csharp._models;
using back_csharp._models.Enums;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<Comment> AddCommentAsync(CommentDTO commentDTO);
    Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId);
    Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0);
}
