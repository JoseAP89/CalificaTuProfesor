namespace back_csharp._dtos;

public class NotificationDTO
{
    public int NotificationId { get; set; }

    public int CommentId { get; set; }

    public int NotificationTypeId { get; set; }

    public string Message { get; set; }

    public string UserId { get; set; }
}
