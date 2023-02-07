using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Vote
    {
        public int VoteId { get; set; }
        public int CommentId { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public bool? Approval { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Comment Comment { get; set; } = null!;
    }
}
