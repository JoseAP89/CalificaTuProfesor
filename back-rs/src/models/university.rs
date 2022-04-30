use sqlx::types::chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct University {
    pub university_id : i32,
    pub name : String,
    pub created_at : DateTime<Utc>,
    pub modified_at : Option<DateTime<Utc>>,
}