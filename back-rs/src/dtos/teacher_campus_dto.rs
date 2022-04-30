use serde::{Deserialize, Serialize};

use super::CampusDTO;

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct TeacherCampusDTO {
    pub roster_id : i32,
    pub teacher_name : String,
    pub teacher_lastname1 : String,
    pub teacher_lastname2 : Option<String>,
    pub subject_name : String,
    pub campus: CampusDTO
}