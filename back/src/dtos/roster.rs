use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct Roster {
    pub roster_id : i32,
    pub campus_id : i32,
    pub teacher_name : String,
    pub teacher_lastname1 : String,
    pub teacher_lastname2 : String,
    pub subject_name : String,
}