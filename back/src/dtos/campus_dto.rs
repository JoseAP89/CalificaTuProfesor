use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct CampusDTO {
    pub campus_id : Option<i32>,
    pub name : String,
    pub university_id: i32,
    pub state_id: i32
}