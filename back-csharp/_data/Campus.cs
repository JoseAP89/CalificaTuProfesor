using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class Campus
    {
        public Campus()
        {
            Rosters = new HashSet<Roster>();
        }

        public int CampusId { get; set; }
        public string Name { get; set; } = null!;
        public int UniversityId { get; set; }
        public int StateId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual State State { get; set; } = null!;
        public virtual University University { get; set; } = null!;
        public virtual ICollection<Roster> Rosters { get; set; }
    }
}
