using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class UniversityArea
    {
        public int UniversityAreaId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<StudyField> StudyFields { get; set; }
    }
}
