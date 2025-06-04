using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Roster
    {
        public Roster()
        {
            Comments = new List<Comment>();
        }

        public int RosterId { get; set; }
        public Guid RecordId { get; set; } 
        public int CampusId { get; set; }
        public string TeacherName { get; set; }
        public string TeacherLastname1 { get; set; }
        public string TeacherLastname2 { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; } = DateTime.UtcNow;

        public virtual Campus Campus { get; set; } = null!;
        public virtual ICollection<Comment> Comments { get; set; }
    }
}
