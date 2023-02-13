using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._models;
using back_csharp._models.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public RatingController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpPost("comment")]
    public async Task<ActionResult<CommentDTO>> AddComment(CommentDTO commentDTO)
    {
        var res = await _uow.Ratings.AddCommentAsync(commentDTO);
        if (res == null)
        {
            return BadRequest("Hubo un error agregando el comentario.");
        }
        return Ok(_mapper.Map<CommentDTO>(res));
    }

    [HttpGet("roster/fullComments/{rosterId}")]
    public async Task<ActionResult<TableData<CommentDTO>>> GetFullComments(int rosterId, int pageSize, SortPaginator sortPage, int pageNumber = 0 )
    {
        var res = await _uow.Ratings.GetCommentsByRosterAsync(rosterId, pageSize, sortPage, pageNumber);
        if (res == null)
        {
            return NotFound("No hay comentarios para el Profesor.");
        }
        return Ok(res);
    }

    [HttpGet($"{nameof(GetRosterRating)}/{{rosterId}}")]
    public async Task<ActionResult<RosterRatingDTO>> GetRosterRating(int rosterId)
    {
        var res = await _uow.Ratings.GetRosterRatingInfoAsync(rosterId);
        if (res == null)
        {
            return NotFound("No hay calificaciones para el Profesor.");
        }
        return Ok(res);
    }
}
