using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_csharp._models;

public class NotificationType
{
    public NotificationType()
    {
        Notifications = new HashSet<Notification>();
    }

    public int NotificationTypeId { get; set; }

    public string Name { get; set; }

    public string Code { get; set; }

    public string Description { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; }
}
