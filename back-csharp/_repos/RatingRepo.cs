using AutoMapper;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._helpers;
using back_csharp._models;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace back_csharp._repos;

public class RatingRepo: IRatingRepo
{
    private const int DECIMAL_DIGITS = 5;
    private readonly TeachersContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly string _connectionString;
    private const double MIN_MONTHS_TO_COMMENT = 3.0;

    public RatingRepo(TeachersContext context, IConfiguration config, IMapper mapper)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
        _connectionString = _config.GetConnectionString("TeachersDB");
    }

    public async Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            // Create a query that retrieves all authors"    
            var sql = @$"
                select g.scaleid, round(CAST(avg(g.stars) as numeric),{DECIMAL_DIGITS}) as stars from roster r
                inner join comment c on r.rosterid=c.rosterid
                inner join grade g on c.commentId=g.commentId
                inner join scale s on g.scaleid=s.scaleid
                where r.rosterid={rosterId} 
                group by g.scaleid 
            ";
            // Use the Query method to execute the query and return a list of objects
            List<GradeDTO> grades = (await connection.QueryAsync<GradeDTO>(sql)).ToList();
            var rating = new RosterRatingDTO
            {
                RosterId = rosterId,
                Grades = grades,
                AverageGrade = grades.Count > 0 ? Math.Round(grades.Average(g => g.Stars), DECIMAL_DIGITS) : 0.0
            };
            return rating;

        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<bool> CanComment(string userId, int teacherId)
    {
        var userComments = await _context.Comments.Where( c => c.UserId.ToString() == userId &&
            c.RosterId == teacherId
        ).OrderByDescending( c => c.CreatedAt).FirstOrDefaultAsync();
        if(string.IsNullOrEmpty(userId) ) userId = Guid.NewGuid().ToString();
        if (userComments != null) 
        {
            // there is one comment already, business rule is to allow more comments for one user
            // for the same teacher/roster if and only if it has passed MIN_MONTHS_TO_COMMENT or more months since his
            // last comment.
            double monthsPassed = DateTime.Now.Subtract(userComments.CreatedAt).Days / (365.2425 / 12.0);
            if (monthsPassed < MIN_MONTHS_TO_COMMENT)
            {
                return false;
            }
            
        }
        return true;
    }

    public async Task<Comment> AddCommentAsync(CommentDTO commentDTO)
    {
        var comment = _mapper.Map<Comment>(commentDTO);
        if (!( await CanComment(comment.UserId.ToString(), comment.RosterId))) 
        {
            throw new Exception($"Ya has comentado con anterioridad al profesor. Deben pasar almenos {MIN_MONTHS_TO_COMMENT} meses para publicar otro comentario.");
        }
        // it only carries one vote, the one of the user who created it, initially his vote is null
        comment.Votes = comment.Votes.Select( v => 
        { 
            v.UserId = comment.UserId; 
            v.Approval = null;
            return v;
        }).ToList(); 
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return comment;  
    }

    public async Task<int> DeleteCommentByIdAsync(int commentId)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == commentId)
            ?? throw new Exception("El comentario no existe.");
        var votes = await _context.Votes.Where(v => v.CommentId == commentId).ToListAsync();
        var grades = await _context.Grades.Where(v => v.CommentId == commentId).ToListAsync();
        _context.Grades.RemoveRange(grades);
        _context.Votes.RemoveRange(votes);
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return commentId;  
    }

    public async Task<Comment> EditCommentContentAsync(CommentContentDTO commentDTO)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync( c => c.CommentId == commentDTO.CommentId) 
            ?? throw new Exception("El comentatio no existe.");
        if (comment.Content == commentDTO.Content) throw new Exception("El comentario no contiene cambios.");
        comment.ModifiedAt = DateTime.Now;
        comment.Content = commentDTO.Content;
        _context.Comments.Update(comment);
        await _context.SaveChangesAsync();
        return comment;  
    }

    public async Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize = 10, SortPaginator pag = SortPaginator.DateDesc, int pageNumber = 0, Guid? currentUserId = null)
    {
        try
        {
            if (currentUserId == null) currentUserId = Guid.NewGuid();
            var comments = await _context.Comments
                .Where(c => c.RosterId == rosterId)
                .Select(c => new Comment
                {
                    CommentId = c.CommentId,
                    RecordId = c.RecordId,
                    RosterId = c.RosterId,
                    StudyFieldId = c.StudyFieldId,
                    SubjectName = c.SubjectName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    ModifiedAt = c.ModifiedAt,
                    UserId = c.UserId,
                    Grades = c.Grades.Select(g => new Grade
                    {
                        GradeId = g.GradeId,
                        Stars = g.Stars,
                        Scale = new Scale
                        {
                            ScaleId = g.Scale.ScaleId,
                            Name = g.Scale.Name,
                            Description = g.Scale.Description
                        }
                    }).ToList(),
                    Votes = c.Votes.Select(v => new Vote
                    {
                        VoteId = v.VoteId,
                        UserId = v.UserId,
                        Approval = v.Approval
                    }).ToList(),
                    StudyField = new StudyField
                    {
                        StudyFieldId = c.StudyField.StudyFieldId,
                        Name = c.StudyField.Name,
                        Code = c.StudyField.Code,
                        UniversityArea = new UniversityArea
                        {
                             UniversityAreaId =c.StudyField.UniversityArea.UniversityAreaId,
                             Name =c.StudyField.UniversityArea.Name,
                             Code =c.StudyField.UniversityArea.Code
                        }
                    }
                })
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            var commentsSorted = _mapper.Map<List<CommentDTO>>(comments).AsEnumerable();
            commentsSorted = commentsSorted.Select(c =>
            {
                foreach (var v in c.Votes)
                {
                    if (v.Approval == true)
                    {
                        c.Likes++;
                    }
                    else if (v.Approval == false)
                    {
                        c.Dislikes++;
                    }
                    if (currentUserId.ToString() == v.UserId)
                    {
                        c.currentUserVote = v.Approval;
                    }
                }
                c.Votes = null; // to avoid send a large amount of votes per comment unnecessarily
                return c;
            });
            switch (pag)
            {
                case SortPaginator.DateAsc:
                    commentsSorted = commentsSorted.OrderBy(c => c.CreatedAt);
                    break;
                case SortPaginator.DateDesc:
                    commentsSorted = commentsSorted.OrderByDescending(c => c.CreatedAt);
                    break;
                case SortPaginator.MostLiked:
                    commentsSorted = commentsSorted.OrderByDescending(c => c.Likes).ThenByDescending(c => c.CreatedAt);
                    break;
                case SortPaginator.MostDisliked:
                    commentsSorted = commentsSorted.OrderByDescending(c => c.Dislikes).ThenByDescending(c => c.CreatedAt);
                    break;
                case SortPaginator.SubjectAsc:
                    commentsSorted = commentsSorted.OrderBy(c => c.SubjectName);
                    break;
                case SortPaginator.SubjectDesc:
                    commentsSorted = commentsSorted.OrderByDescending(c => c.SubjectName);
                    break;
                default:
                    break;
            }
            commentsSorted = commentsSorted.ToList();
            var table = new TableData<CommentDTO>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalElements = comments.Count,
                Data = commentsSorted
                    .Skip(pageSize * pageNumber)
                    .Take(pageSize)
                    .ToList()
            };
            return table;

        }
        catch (Exception _e)
        {
            return null;
        }
    }

    public async Task<TableData<RankingTopTeacherDTO>> GetRankingTopTeacherAsync(Guid campusRecordId, int pageSize = 20, int pageNumber = 0, bool sortByRank = false, string search = null)
    {
        try
        {
            var ranksQuery = (
                from r in _context.Rosters
                join k in _context.Campuses on r.CampusId equals k.CampusId
                join c in _context.Comments on r.RosterId equals c.RosterId into commentsJoin
                from c in commentsJoin.DefaultIfEmpty()
                join g in _context.Grades on c.CommentId equals g.CommentId into gradesJoin
                from g in gradesJoin.DefaultIfEmpty()
                group new
                {
                    CommentId = c != null ? c.CommentId : 0,
                    r.TeacherName,
                    r.TeacherLastname1,
                    r.TeacherLastname2,
                    Stars = g != null ? g.Stars : 0,
                    k.CampusId,
                    CampusName = k.Name,
                    CampusRecordId = k.RecordId,
                    RosterRecordId = r.RecordId
                }
                by new { r.RecordId, k.CampusId } into ranking
                select new RankingTopTeacherDTO
                {
                    TeacherRecordId = ranking.First().RosterRecordId.ToString(),
                    Name = ranking.First().TeacherName,
                    FirstLastName = ranking.First().TeacherLastname1,
                    SecondLastName = ranking.First().TeacherLastname2,
                    AverageGrade = ranking.Average(row => row.Stars),
                    CampusName = ranking.First().CampusName,
                    CampusId = ranking.First().CampusId,
                    Rank = 0,
                    TotalComments = ranking
                        .Where(x => x.CommentId > 0)
                        .Select(x => x.CommentId).Distinct().Count(),
                    CampusRecordId = ranking.First().CampusRecordId.ToString(),
                    RosterRecordId = ranking.First().RosterRecordId.ToString(),
                }
            );

            if (campusRecordId != Guid.Empty)
            {
                ranksQuery = ranksQuery.Where(r => r.CampusRecordId == campusRecordId.ToString());    
            }

            if(!string.IsNullOrEmpty(search))
            {
                ranksQuery = ranksQuery
                    .Where(r => EF.Functions.ILike(
                        TeachersContext.Unaccent(r.Name + " " + r.FirstLastName + " " + r.SecondLastName).Trim(),
                        "%" + TeachersContext.Unaccent(search.Trim()) + "%"))
                    .OrderBy(r => r.FirstLastName)
                    .ThenBy(r => r.SecondLastName)
                    .ThenBy(r => r.Name);
            }
            else if (sortByRank)
            {
                ranksQuery = ranksQuery.OrderByDescending(r => r.AverageGrade )
                    .ThenBy(r => r.Name);
            } 
            else
            {
                ranksQuery = ranksQuery.OrderBy(r => r.FirstLastName)
                    .ThenBy(r => r.SecondLastName)
                    .ThenBy(r => r.Name);
            }

            var ranks = await ranksQuery
                .AsNoTracking()
                .ToListAsync();
            var totalElements = ranks.Count;
            ranks = ranks
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .ToList();
            if (sortByRank && ranks.Count>0)
            {
                int rankNumber = 1;
                foreach (var item in ranks)
                {
                    item.Rank = rankNumber;
                    rankNumber++;
                }
            }
            return new TableData<RankingTopTeacherDTO>
            {
                Data = ranks,
                PageNumber = pageNumber,
                PageSize = pageSize,    
                TotalElements = totalElements
            };

        }
        catch (Exception e)
        {
            return null;
        }
    }
}
