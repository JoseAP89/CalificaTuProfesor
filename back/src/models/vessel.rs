use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct Vessel {
    pub id: i32,
    pub name: String
}