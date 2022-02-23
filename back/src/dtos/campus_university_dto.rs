use serde::{Deserialize, Serialize};

use super::UniversityDTO;

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct CampusUniversityDTO {
    pub campus_id : i32,
    pub name : String,
    pub university: UniversityDTO
}