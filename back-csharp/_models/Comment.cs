using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Comment
    {
        public Comment()
        {
            Grades = new List<Grade>(); 
        }
        public int CommentId { get; set; }
        public Guid RecordId { get; set; }
        public int RosterId { get; set; }
        public string SubjectName { get; set; }
        public string Content { get; set; } = null!;
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Roster Roster { get; set; } = null!;
        public virtual ICollection<Grade> Grades { get; set; }
        public virtual ICollection<Vote> Votes { get; set; } = null!;
    }
}
