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
    private readonly TeachersContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly string _connectionString;

    public RatingRepo(TeachersContext context, IConfiguration config, IMapper mapper)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
        _connectionString = _config.GetConnectionString("TeachersDB");
    }

    public async Task<RosterRatingDTO> GetRosterRatingInfoAsync(int rosterId)
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
        if (grades == null || grades.Count == 0)
        {
            return null;
        }
        var rating = new RosterRatingDTO
        {
            RosterId = rosterId,
            Grades = grades,
            AverageGrade = Math.Round(grades.Average(g => g.Stars), 1),
        };
        return rating;  
    }

    public async Task<Comment> AddCommentAsync(CommentDTO commentDTO)
    {
        var comment = _mapper.Map<Comment>(commentDTO);
        if(string.IsNullOrEmpty(commentDTO.UserId) ) comment.UserId = Guid.NewGuid();
        // it only carries one vote, the one of the user who created it
        comment.Votes = comment.Votes.Select( v => { v.UserId = comment.UserId; return v;}).ToList(); 
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return comment;  
    }

    public async Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0)
    {
        var comments = await _context.Comments
            .Where(c => c.RosterId == rosterId)
            .Include(c => c.Grades)
            .ThenInclude(g => g.Scale)
            .Include(c => c.Votes)
            .AsSplitQuery()
            .AsNoTracking()
            .ToListAsync()
            ;
        if (comments == null || comments.Count == 0)
        {
            return null;
        }
        var commentsSorted = _mapper.Map<List<CommentDTO>>(comments).AsEnumerable();
        commentsSorted = commentsSorted.Select( c =>
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
            }
            return c;
        });
        switch (pag)
        {
            case SortPaginator.DateAsc:
                commentsSorted = commentsSorted.OrderBy( c => c.CreatedAt);
                break;
            case SortPaginator.DateDesc:
                commentsSorted = commentsSorted.OrderByDescending( c => c.CreatedAt);
                break;
            case SortPaginator.MostLiked:
                commentsSorted = commentsSorted.OrderBy( c => c.Likes).ThenByDescending( c => c.CreatedAt);
                break;
            case SortPaginator.MostDisliked:
                commentsSorted = commentsSorted.OrderBy( c => c.Dislikes).ThenByDescending( c => c.CreatedAt);
                break;
            case SortPaginator.SubjectAsc:
                commentsSorted = commentsSorted.OrderBy( c => c.SubjectName);
                break;
            case SortPaginator.SubjectDesc:
                commentsSorted = commentsSorted.OrderByDescending( c => c.SubjectName);
                break;
            default:
                break;
        }
        commentsSorted = commentsSorted.ToList();
        var table = new TableData<CommentDTO>();
        table.PageNumber = pageNumber;
        table.PageSize = pageSize;
        table.TotalElements = comments.Count;
        table.Data = commentsSorted
            .Skip(pageSize * pageNumber)
            .Take(pageSize)
            .ToList();
        return table;
    }

}
