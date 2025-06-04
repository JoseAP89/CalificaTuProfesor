using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_csharp._models;

public class Notification
{
    public int NotificationId { get; set; }

    public int CommentId { get; set; }

    public int NotificationTypeId { get; set; }

    public string Message { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; } =   DateTime.UtcNow;

    public Comment Comment { get; set; }

    public NotificationType NotificationType { get; set; }
}