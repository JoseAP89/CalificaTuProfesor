using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Intrinsics.X86;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
/*  This controller handles Comments and Grade tabe functionalities, as well as the creation of the Vote list,
 *  but the voting process itself is managed by the VoteController
 *  */
public class RatingController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public RatingController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpGet("can-comment")]
    public async Task<ActionResult<CommentDTO>> CanComment(string userId, int teacherId)
    {
        var res = await _uow.Ratings.CanComment(userId, teacherId);
        return Ok(res);
    }

    [HttpPost("comment")]
    public async Task<ActionResult<CommentDTO>> AddComment(CommentDTO commentDTO)
    {
        var wordsToAnalyze = new List<string> {
                commentDTO.Content,
                commentDTO.SubjectName
            };
        var axumResponse = await _uow.AxumService.AnalyzeWordsAsync(new AxumFilterRequest
        {
            Words = wordsToAnalyze
        });
        if (axumResponse?.IsInappropiate ?? true)
        {
            return BadRequest(axumResponse?.Message ?? "Hubo un error analizando el contenido de las palabras.");
        }
        var res = await _uow.Ratings.AddCommentAsync(commentDTO);
        if (res == null)
        {
            return BadRequest("Hubo un error agregando el comentario.");
        }
        return Ok(_mapper.Map<CommentDTO>(res));
    }

    [HttpGet("comment/{commentId}")]
    public async Task<ActionResult<CommentDTO>> GetComment(int commentId)
    {
        var res = await _uow.Ratings.GetCommentAsync(commentId);
        if (res == null)
        {
            return NotFound("No hay ningun comentario con ese id.");
        }
        return Ok(res);
    }

    [HttpDelete("comment/{commentId}")]
    public async Task<ActionResult<int>> DeleteComment(int commentId)
    {
        int res = -1;
        res = await _uow.Ratings.DeleteCommentByIdAsync(commentId);
        if (res == -1)
        {
            return BadRequest("Hubo un error borrando el comentario.");
        }
        return Ok(res);
    }

    [HttpPatch("comment")]
    public async Task<ActionResult<CommentDTO>> EditCommentContent(CommentContentDTO commentDTO)
    {
        var wordsToAnalyze = new List<string> {
            commentDTO.Content
        };
        var axumResponse = await _uow.AxumService.AnalyzeWordsAsync(new AxumFilterRequest
        {
            Words = wordsToAnalyze
        });
        if (axumResponse?.IsInappropiate ?? true)
        {
            return BadRequest(axumResponse?.Message ?? "Hubo un error analizando el contenido de las palabras.");
        }
        var res = await _uow.Ratings.EditCommentContentAsync(commentDTO);
        if (res == null)
        {
            return BadRequest("Hubo un error editando el comentario.");
        }
        return Ok(_mapper.Map<CommentDTO>(res));
    }


    [HttpGet("roster/fullComments/{rosterId}")]
    public async Task<ActionResult<TableData<FullCommentDTO>>> GetFullComments(int rosterId, int pageSize = 10, SortPaginator sortPage = SortPaginator.DateDesc, int pageNumber = 0, Guid? currentUserId = null)
    {
        var res = await _uow.Ratings.GetCommentsByRosterAsync(rosterId, pageSize, sortPage, pageNumber, currentUserId);
        if (res == null)
        {
            return NotFound("Hubo un error obteniendo la lista de comentarios del profesor.");
        }
        return Ok(res);
    }

    [HttpGet($"{nameof(GetRosterRating)}/{{rosterId}}")]
    public async Task<ActionResult<RosterRatingDTO>> GetRosterRating(int rosterId)
    {
        var res = await _uow.Ratings.GetRosterRatingInfoAsync(rosterId);
        if (res == null)
        {
            return NotFound("Hubo un error obteniendo las calificaciones del profesor.");
        }
        return Ok(res);
    }

    [HttpGet("teacher/ranking")]
    public async Task<ActionResult<TableData<CampusTeacherListDTO>>> GetRankingTopTeacherList(string campusRecordIdStr = "", int pageSize = 20, int pageNumber = 0, bool sortByRank = false, string search = null)
    {
        Guid campusRecordId = string.IsNullOrEmpty(campusRecordIdStr)? Guid.Empty : new Guid(campusRecordIdStr);
        var res = await _uow.Ratings.GetTeachersTableAsync(campusRecordId, pageSize, pageNumber, sortByRank, search);
        if (res == null)
        {
            return NotFound("Hubo un error obteniendo la lista de rankings.");
        }
        return Ok(res);
    }

}
