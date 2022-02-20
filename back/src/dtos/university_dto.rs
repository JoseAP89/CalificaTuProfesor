use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UniversityDTO {
    pub university_id : i32,
    pub name : String
}