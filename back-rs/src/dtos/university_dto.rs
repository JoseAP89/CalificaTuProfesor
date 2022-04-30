use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UniversityDTO {
    pub university_id : Option<i32>,
    pub name : String,
    pub img_file : Option<String>,
    pub img_type : Option<String>
}