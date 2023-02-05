using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Scale
    {
        public Scale()
        {
            Grades = new HashSet<Grade>();
            RosterScales = new HashSet<RosterScale>();
        }

        public int ScaleId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<Grade> Grades { get; set; }
        public virtual ICollection<RosterScale> RosterScales { get; set; }
    }
}
