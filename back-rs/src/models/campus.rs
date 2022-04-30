use sqlx::types::chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct Campus {
    pub campus_id : i32,
    pub name : String,
    pub university_id : i32,
    pub state_id : i32,
    pub created_at : DateTime<Utc>,
    pub modified_at : Option<DateTime<Utc>>,
}