namespace back_csharp._models;

public class StudyField
{
        public StudyField()
        {
            Comments = new List<Comment>();
        }

        public int StudyFieldId { get; set; }
        public string Name { get; set; } = null!;
        public string Code { get; set; } = null!;
        public int UniversityAreaId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public UniversityArea UniversityArea { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
}