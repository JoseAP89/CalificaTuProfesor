﻿using System;
using System.Collections.Generic;

namespace back_csharp._models
{
    public partial class Roster
    {
        public Roster()
        {
            Comments = new HashSet<Comment>();
            RosterScales = new HashSet<RosterScale>();
        }

        public int RosterId { get; set; }
        public Guid RecordId { get; set; } 
        public int CampusId { get; set; }
        public string TeacherName { get; set; }
        public string TeacherLastname1 { get; set; }
        public string TeacherLastname2 { get; set; }
        public int UniStructureId { get; set; }
        public string StructureName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Campus Campus { get; set; } = null!;
        public virtual UniStructure UniStructure { get; set; } = null!;
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<RosterScale> RosterScales { get; set; }
    }
}
