using System.Text.Json.Serialization;

namespace back_csharp._dtos;

public class TeacherCampus
{
    [JsonPropertyName("roster_id")]
    public int RosterId { get; set; }
    [JsonPropertyName("campus")]
    public CampusDto Campus {get; set;}
    [JsonPropertyName("teacher_name")]
    public string TeacherName {get; set;}
    [JsonPropertyName("teacher_lastname1")]
    public string TeacherLastname1 {get; set;}
    [JsonPropertyName("teacher_lastname2")]
    public string TeacherLastname2 {get; set;}
    [JsonPropertyName("subject_name")]
    public string SubjectName {get; set;}
}