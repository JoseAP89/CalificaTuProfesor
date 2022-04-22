using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class Scale
    {
        public Scale()
        {
            Grades = new HashSet<Grade>();
        }

        public int ScaleId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<Grade> Grades { get; set; }
    }
}
