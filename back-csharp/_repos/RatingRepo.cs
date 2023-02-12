using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._helpers;
using back_csharp._models;
using back_csharp._models.Enums;
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
        comment.TokenId = Guid.NewGuid().ToString();
        _context.Set<Comment>().Add(comment);
        await _context.SaveChangesAsync();
        return comment;  
    }

    public async Task<TableData<CommentDTO>> GetCommentsByRosterAsync(int rosterId, int pageSize, SortPaginator pag, int pageNumber = 0)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        // Create a query that retrieves all authors"    
        var sql = @$"
            select 
			r.rosterid AS RosterRosterid,	r.campusid AS RosterCampusid,	r.teachername AS RosterTeachername,	r.teacherlastname1 AS RosterTeacherlastname1,	r.teacherlastname2 AS RosterTeacherlastname2,	r.unistructureid AS RosterUnistructureid,	r.structurename AS RosterStructurename,	r.createdat AS RosterCreatedat,	r.modifiedat AS RosterModifiedat,	r.recordid AS RosterRecordid,
			c.commentid AS CommentCommentid,	c.rosterid AS CommentRosterid,	c.content AS CommentContent,	c.tokenid AS CommentTokenid,	c.createdat AS CommentCreatedat,	c.modifiedat AS CommentModifiedat,	c.recordid AS CommentRecordid,	c.subjectname AS CommentSubjectname,
			g.gradeid AS GradeGradeid,	g.scaleid AS GradeScaleid,	g.commentid AS GradeCommentid,	g.stars AS GradeStars,	g.createdat AS GradeCreatedat,	g.modifiedat AS GradeModifiedat,
			s.scaleid AS ScaleScaleid,	s.code AS ScaleCode,	s.name AS ScaleName,	s.description AS ScaleDescription,	s.createdat AS ScaleCreatedat,	s.modifiedat AS ScaleModifiedat,
			v.voteid AS VoteVoteid,	v.commentid AS VoteCommentid,	v.approval AS VoteApproval,	v.createdat AS VoteCreatedat,	v.modifiedat AS VoteModifiedat,	v.likes AS VoteLikes,	v.dislikes AS VoteDislikes
			FROM roster r
            INNER JOIN comment c ON r.rosterid=c.rosterid 
            INNER JOIN grade g ON c.commentId=g.commentId 
            INNER JOIN scale s ON g.scaleid=s.scaleid 
			INNER JOIN vote v ON c.commentid=v.commentid 
            WHERE r.rosterid={rosterId} 
        ";
        // Use the Query method to execute the query and return a list of objects
        List<FullCommentDB> commentDB = (await connection.QueryAsync<FullCommentDB>(sql))
            .ToList();
        var fullCommentDto = commentDB.Select(c => c.ConvertToFullCommentDTO()).GroupBy( f => f.Comment.CommentId);
        var comments = new List<CommentDTO>();
        var commentsSorted = comments.AsEnumerable();
        foreach (var item in fullCommentDto)
        {
            var comment = new CommentDTO();
            var firstComment = item.FirstOrDefault();   
            comment.CommentId = item.Key;
            comment.SubjectName = firstComment.Comment.SubjectName;
            comment.Content = firstComment.Comment.Content;
            comment.TokenId = firstComment.Comment.TokenId;
            comment.RecordId = firstComment.Comment.RecordId;
            comment.RosterId = firstComment.Comment.RosterId;
            comment.CreatedAt = firstComment.Comment.CreatedAt;
            comment.ModifiedAt = firstComment.Comment.ModifiedAt;
            comment.Vote = _mapper.Map<VoteDTO>(firstComment.Vote);
            comment.Grades = _mapper.Map<List<GradeDTO>>(item.Select( c => c.Grade));
            comments.Add(comment);
        }
        switch (pag)
        {
            case SortPaginator.DateAsc:
                commentsSorted = comments.OrderBy( c => c.CreatedAt);
                break;
            case SortPaginator.DateDesc:
                commentsSorted = comments.OrderByDescending( c => c.CreatedAt);
                break;
            case SortPaginator.MostLiked:
                commentsSorted = comments.OrderBy( c => c.Vote.Likes);
                break;
            case SortPaginator.MostDisliked:
                commentsSorted = comments.OrderBy( c => c.Vote.Dislikes);
                break;
            case SortPaginator.SubjectAsc:
                commentsSorted = comments.OrderBy( c => c.SubjectName);
                break;
            case SortPaginator.SubjectDesc:
                commentsSorted = comments.OrderByDescending( c => c.SubjectName);
                break;
            default:
                break;
        }
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
