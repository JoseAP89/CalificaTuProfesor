using back_csharp._dtos;
using back_csharp._models;

namespace back_csharp._contracts;

public interface INotificationRepo
{
    Task<List<NotificationType>> GetAllNotificationTypesAsync();
    Task<Notification> PostNotificationAsync(NewNotificationDTO data);
    Task<Notification> GetNotificationByUserRecordIdAsync(string recordId);
}
