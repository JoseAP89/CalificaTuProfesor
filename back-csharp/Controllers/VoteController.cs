using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VoteController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public VoteController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }



    [HttpPost()]
    public async Task<VoteDTO> AddVote(VoteDTO voteDto)
    {
        var vote = await _uow.Votes.AddVote(voteDto);
        return _mapper.Map<VoteDTO>(vote);
    }

}
