using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Grade
    {
        public int GradeId { get; set; }
        public int ScaleId { get; set; }
        public int CommentId { get; set; }
        public string TokenId { get; set; }
        public int? Stars { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Comment Comment { get; set; } = null!;
        public virtual Scale Scale { get; set; } = null!;
    }
}
