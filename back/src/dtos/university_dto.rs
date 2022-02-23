use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UniversityDTO {
    pub university_id : Option<i32>,
    pub name : String,
    pub img_path : Option<String>
}