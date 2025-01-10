using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class UniversityArea
    {
        public UniversityArea()
        {
            StudyFields = new List<StudyField>();
        }

        public int UniversityAreaId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<StudyField> StudyFields { get; set; }
    }
}
