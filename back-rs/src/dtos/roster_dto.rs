use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct RosterDTO {
    pub roster_id : Option<i32>,
    pub campus_id : i32,
    pub teacher_name : String,
    pub teacher_lastname1 : String,
    pub teacher_lastname2 : String,
    pub subject_name : String,
    pub uni_structure_id : i32,
    pub structure_name : String
}