namespace back_csharp._dtos;

public class CreateRosterDto
{ 
        public int RosterId { get; set; }
        
        public string TeacherName { get; set; }

        public string TeacherLastname1 { get; set; }

        public string TeacherLastname2 { get; set; }

        public string SubjectName { get; set; }

        
        public int CampusId { get; set; }
        
}