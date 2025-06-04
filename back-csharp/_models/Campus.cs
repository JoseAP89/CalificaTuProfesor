using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Campus
    {

        public Campus()
        {
            Rosters = new HashSet<Roster>();
        }

        public int CampusId { get; set; }
        public Guid RecordId { get; set; }
        public string Name { get; set; } = null!;
        public int UniversityId { get; set; }
        public int StateId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; } = DateTime.UtcNow;

        public virtual State State { get; set; } = null!;
        public virtual University University { get; set; } = null!;
        public virtual ICollection<Roster> Rosters { get; set; }
    }
}
