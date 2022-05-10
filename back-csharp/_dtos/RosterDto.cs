using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class RosterDto
{ 
        [JsonPropertyName("roster_id")]
        public int RosterId { get; set; }
        
        [JsonPropertyName("teacher_name") ]
        public string TeacherName { get; set; }

        [JsonPropertyName("teacher_lastname1")]
        public string TeacherLastname1 { get; set; }

        [JsonPropertyName("teacher_lastname2")]
        public string TeacherLastname2 { get; set; }

        [JsonPropertyName("subject_name")] 
        public string SubjectName { get; set; }

        [JsonPropertyName("uni_structure_id")] 
        public int UniStructureId { get; set; }
        
        [JsonPropertyName("structure_type")] 
        public string StructureType { get; set; }

        [JsonPropertyName("campus_id")] 
        public int CampusId { get; set; }
        
        [JsonPropertyName("campus_name")] 
        public string CampusName { get; set; }

        [JsonPropertyName("structure_name")] 
        public string StructureName { get; set; }
}