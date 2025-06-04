using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._models;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public NotificationController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    [HttpGet("type")]
    public async Task<ActionResult<List<NotificationTypeDTO>>> GetNotificationTypes()
    {
        var res = await _uow.Notifications.GetAllNotificationTypesAsync();
        if (res == null)
        {
            return NotFound();
        }
        return Ok(res.Select( n => new NotificationTypeDTO
        {
            Name = n.Name,
            Code = n.Code,
            Description = n.Description
        }).ToList());
    }

    [HttpGet("{userRecordId}")]
    public async Task<ActionResult<NotificationDTO>> GetNotificationByUserRecordId(string userRecordId)
    {
        var res = await _uow.Notifications.GetNotificationByUserRecordIdAsync(userRecordId);
        if (res == null)
        {
            return NotFound();
        }
        return Ok(new NotificationDTO
        {
            NotificationId = res.NotificationId,
            Message = res.Message,
            CommentId = res.CommentId,
            UserId = res.UserId.ToString(),
            NotificationTypeId = res.NotificationTypeId,
        });
    }

    [HttpPost()]
    public async Task<ActionResult<NotificationDTO>> PostNotification(NewNotificationDTO notification)
    {
        var axumResponse = await _uow.AxumService.AnalyzeWordsAsync(notification.Message);
        if (axumResponse?.IsInappropiate ?? true)
        {
            return BadRequest(axumResponse?.Message ?? "Hubo un error analizando el contenido de las palabras.");
        }
        var res = await _uow.Notifications.PostNotificationAsync(notification);
        if (res == null)
        {
            return NotFound();
        }
        return Ok(new NotificationDTO
        {
            NotificationId = res.NotificationId,
            Message = res.Message,
            CommentId = res.CommentId,
            UserId = res.UserId.ToString(),
            NotificationTypeId = res.NotificationTypeId,
        });
    }
}
