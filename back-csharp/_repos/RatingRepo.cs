using AutoMapper;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._helpers;
using back_csharp._models;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Server.IIS;
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
                select g.scaleid, round(CAST(avg(g.stars) as numeric),1) as stars from roster r
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
                AverageGrade = grades.Count > 0 ? Math.Round(grades.Average(g => g.Stars), 1) : 0.0
            };
            return rating;

        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<Comment> AddCommentAsync(CommentDTO commentDTO)
    {
        var comment = _mapper.Map<Comment>(commentDTO);
        if(string.IsNullOrEmpty(commentDTO.UserId) ) comment.UserId = Guid.NewGuid();
        var userComments = await _context.Comments.Where( c => c.UserId == comment.UserId &&
            c.RosterId == commentDTO.RosterId
        ).OrderByDescending( c => c.CreatedAt).FirstOrDefaultAsync();
        if (userComments != null) 
        {
            // there is one comment already, business rule is to allow more comments for one user
            // for the same teacher/roster if and only if it has passed MIN_MONTHS_TO_COMMENT or more months since his
            // last comment.
            double monthsPassed = DateTime.Now.Subtract(userComments.CreatedAt).Days / (365.2425 / 12.0);
            if (monthsPassed < MIN_MONTHS_TO_COMMENT)
            {
                throw new Exception($"Ya has comentado con anterioridad al profesor. Deben pasar almenos {MIN_MONTHS_TO_COMMENT} meses para publicar otro comentario.");
            }
            
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

    public async Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0, Guid? currentUserId = null)
    {
        try
        {
            if (currentUserId == null) currentUserId = Guid.NewGuid();
            var comments = await _context.Comments
                .Where(c => c.RosterId == rosterId)
                .Include(c => c.Grades)
                .ThenInclude(g => g.Scale)
                .Include(c => c.Votes)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync()
                ;
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
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<List<RankingDTO>> GetTeachersRankingAsync(Guid campusRecordId, int pageSize = 20, int pageNumber = 0)
    {
        try
        {
            var ranksQuery = (
                from c in _context.Comments
                join g in _context.Grades on c.CommentId equals g.CommentId
                join s in _context.Scales on g.ScaleId equals s.ScaleId
                join r in _context.Rosters on c.RosterId equals r.RosterId
                join k in _context.Campuses on r.CampusId equals k.CampusId
                group new
                {
                    r.TeacherName,
                    r.TeacherLastname1,
                    r.TeacherLastname2,
                    RosterRecordId = r.RecordId,
                    g.Stars,
                    CampusRecordId = k.RecordId,
                    CampusName = k.Name,
                }
                by r.RecordId into ranking
                select new RankingDTO
                {
                    RosterRecordId = ranking.First().RosterRecordId,
                    CampusRecordId = ranking.First().CampusRecordId,
                    TeacherFullName = (ranking.First().TeacherName + ' ' + ranking.First().TeacherLastname1 + ' ' + ranking.First().TeacherLastname2).Trim(),
                    Score = ranking.Average(row => row.Stars),
                    CampusName = ranking.First().CampusName,
                }
            );

            if (campusRecordId != Guid.Empty)
            {
                ranksQuery = ranksQuery.Where(r => r.CampusRecordId == campusRecordId);    
            }

            var ranks = await ranksQuery
                .AsNoTracking()
                .OrderByDescending( r => r.Score )
                .ThenBy( r => r.TeacherFullName )
                .Skip( pageNumber * pageSize )
                .Take( pageSize )   
                .ToListAsync();
            return ranks.Select( r =>
            {
                r.Score = Math.Round(r.Score, DECIMAL_DIGITS);
                return r;
            }).ToList();

        }
        catch (Exception )
        {
            return null;
        }
    }
}
