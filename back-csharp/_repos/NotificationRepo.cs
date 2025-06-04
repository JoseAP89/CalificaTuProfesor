using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._models;
using back_csharp.Middleware.models;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class NotificationRepo: INotificationRepo
{
    private readonly TeachersContext _context;

    public NotificationRepo(TeachersContext context)
    {
        _context = context;
    }

    public async Task<List<NotificationType>> GetAllNotificationTypesAsync()
    {
        return await _context.NotificationTypes
            .OrderBy(n => n.Name)
            .ToListAsync();  
    }

    public async Task<Notification> GetNotificationByUserRecordIdAsync(string recordId)
    {
        if (string.IsNullOrEmpty(recordId))
        {
            throw new ApiException($"El record ID del usuario es requerido");
        }
        var res =  await _context.Notifications
            .Where(n => n.UserId.ToString() == recordId)
            .FirstOrDefaultAsync();
        return res;
    }

    public async Task<Notification> PostNotificationAsync(NewNotificationDTO data)
    {
        if (string.IsNullOrEmpty(data.UserId))
        {
            data.UserId = Guid.NewGuid().ToString();
        }
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(u => u.CommentId == data.CommentId && u.UserId.ToString() == data.UserId);
        if (notification != null && notification.NotificationId > 0)
        {
            throw new ApiException($"No puede agregarse ya que ya has hecho una previa notificación en el comentario.");
        }

        var newNotification = new Notification
        {
            NotificationTypeId = data.NotificationTypeId,
            UserId = Guid.Parse(data.UserId),
            CommentId = data.CommentId,
            Message = data.Message,
        };

        _context.Notifications.Add(newNotification);
        await _context.SaveChangesAsync();
        return newNotification;

    }
}
