using System;
using System.Collections.Generic;

namespace back_csharp._data
{
    public partial class Grade
    {
        public int GradeId { get; set; }
        public int ScaleId { get; set; }
        public int RosterId { get; set; }
        public string? OwnerIp { get; set; }
        public int? Stars { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Roster Roster { get; set; } = null!;
        public virtual Scale Scale { get; set; } = null!;
    }
}
