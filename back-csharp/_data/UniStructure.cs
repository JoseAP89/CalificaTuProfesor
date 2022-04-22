using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class UniStructure
    {
        public UniStructure()
        {
            Rosters = new HashSet<Roster>();
        }

        public int UniStructureId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<Roster> Rosters { get; set; }
    }
}
