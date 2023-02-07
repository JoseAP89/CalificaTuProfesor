using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._models;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace back_csharp._repos;

public class RatingRepo: IRatingRepo
{
    private readonly DbContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly string _connectionString;

    public RatingRepo(DbContext context, IConfiguration config, IMapper mapper)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
        _connectionString = _config.GetConnectionString("TeachersDB");
    }

    public async Task<RosterRatingDTO> GetRosterRatingInfo(int rosterId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        // Create a query that retrieves all authors"    
        var sql = @$"
            select g.scaleid, round(CAST(avg(g.stars) as numeric),1) as stars from roster r
            inner join comment c on r.rosterid=c.rosterid
            inner join grade g on c.commentId=g.commentId
            inner join scale s on g.scaleid=s.scaleid
            where r.rosterid={rosterId} group by g.scaleid 
        ";
        // Use the Query method to execute the query and return a list of objects
        List<GradeDTO> grades = (await connection.QueryAsync<GradeDTO>(sql)).ToList();
        var rating = new RosterRatingDTO
        {
            RosterId = rosterId,
            Grades = grades,
            AverageGrade = Math.Round(grades.Average(g => g.Stars), 1),
        };
        return rating;  
    }

    public async Task<Comment> AddComment(CommentDTO commentDTO)
    {
        var comment = _mapper.Map<Comment>(commentDTO);
        comment.TokenId = Guid.NewGuid().ToString();
        _context.Set<Comment>().Add(comment);
        await _context.SaveChangesAsync();
        return comment;  
    }
}
