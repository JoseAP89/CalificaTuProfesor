using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._models;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<bool> CanComment(string userId, int teacherId);
    Task<Comment> AddCommentAsync(CommentDTO commentDTO);
    Task<Comment> EditCommentContentAsync(CommentContentDTO commentDTO);
    Task<int> DeleteCommentByIdAsync(int commentId);
    Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId);
    Task<CommentDTO> GetCommentAsync(int commentId);
    Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0, Guid? currentUserId = null);
    /// <summary>
    /// Gets the list of teachers with option to convert the list in a ranking list
    /// </summary>
    /// <param name="campusRecordId"></param>
    /// <param name="pageSize"></param>
    /// <param name="pageNumber"></param>
    /// <param name="sortByRank"></param>
    /// <returns></returns>
    Task<TableData<RankingTopTeacherDTO>> GetRankingTopTeacherAsync(Guid campusRecordId, int pageSize = 20, int pageNumber = 0, bool sortByRank = false, string search = null);
}
