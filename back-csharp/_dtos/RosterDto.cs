namespace back_csharp._dtos;

public class RosterDto
{ 
        public int RosterId { get; set; }
        public Guid RecordId { get; set; }
        
        public string TeacherName { get; set; }

        public string TeacherLastname1 { get; set; }

        public string TeacherLastname2 { get; set; }


        public int CampusId { get; set; }
        
        public string CampusName { get; set; }

}