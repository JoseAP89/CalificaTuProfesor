using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class Comment
    {
        public Comment()
        {
            Votes = new HashSet<Vote>();
        }

        public int CommentId { get; set; }
        public int RosterId { get; set; }
        public string Comment1 { get; set; } = null!;
        public string? OwnerIp { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Roster Roster { get; set; } = null!;
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
