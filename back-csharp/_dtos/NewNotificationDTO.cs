using System.ComponentModel.DataAnnotations;

namespace back_csharp._dtos;

public class NewNotificationDTO
{
    public int NotificationId { get; set; }

    [Required]
    public int CommentId { get; set; }

    [Required]
    public int NotificationTypeId { get; set; }

    [Required]
    [MaxLength(300)]    
    public string Message { get; set; }

    public string UserId { get; set; }
}
