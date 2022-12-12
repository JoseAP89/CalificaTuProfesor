using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class State
    {
        public State()
        {
            Campuses = new HashSet<Campus>();
        }

        public int StateId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual ICollection<Campus> Campuses { get; set; }
    }
}
