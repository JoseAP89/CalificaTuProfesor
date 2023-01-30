﻿using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Comment
    {
        public Comment()
        {
            Votes = new HashSet<Vote>();
        }

        public int CommentId { get; set; }
        public int RosterId { get; set; }
        public string Content { get; set; } = null!;
        public string TokenId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Roster Roster { get; set; } = null!;
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
