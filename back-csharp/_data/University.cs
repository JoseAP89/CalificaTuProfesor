using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class University
    {
        public University()
        {
            Campuses = new HashSet<Campus>();
        }

        public int UniversityId { get; set; }
        public string Name { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<Campus> Campuses { get; set; }
    }
}
