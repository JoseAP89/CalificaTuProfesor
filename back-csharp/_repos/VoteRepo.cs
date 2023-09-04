using AutoMapper;
using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._models;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class VoteRepo: IVoteRepo
{
    private readonly TeachersContext _context;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;

    public VoteRepo(TeachersContext context, IConfiguration config, IMapper mapper)
    {
        _context = context;
        _config = config;
        _mapper = mapper;
    }

    public async Task<Vote> GetByUserAndCommentId(Guid userId, int commentId)
    {
        Vote vote = await _context.Votes.FirstOrDefaultAsync(v => v.UserId == userId && v.CommentId == commentId);
        return vote;
    }

    public async Task<Vote> AddVote(VoteDTO voteDto)
    {
        if (voteDto.UserId == "") voteDto.UserId = null;
        var vote = _mapper.Map<Vote>(voteDto);
        vote.UserId = String.IsNullOrEmpty(voteDto.UserId) ? Guid.NewGuid() : new Guid(voteDto.UserId);
        var userVote = await GetByUserAndCommentId(vote.UserId, vote.CommentId);
        if (userVote!=null)
        {
            if (userVote.Approval == voteDto.Approval) // if it is the same boolean value then remove the vote form the comment
            {
                userVote.Approval = null;
            }
            else
            {
                userVote.Approval = vote.Approval;
            }
            userVote.ModifiedAt = DateTime.Now;
            _context.Update(userVote);
        } 
        else
        {
            _context.Votes.Add(vote);
        }
        await _context.SaveChangesAsync();
        return vote;
    }

}
