using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class University
    {
        public University()
        {
            Campuses = new HashSet<Campus>();
        }

        public int UniversityId { get; set; }
        public Guid RecordId { get; set; }
        public string Name { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Campus> Campuses { get; set; }
    }
}
