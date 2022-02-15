use async_trait::async_trait;
use sqlx::types::chrono::{DateTime, Utc};
use crate::repositories::universities::universityRepo::UniversityRepo;

#[async_trait]
pub trait Repository<T,E> {
    async fn new() -> UniversityRepo;
    async fn get_by_id(&self, id: i32) -> Result<T,E>; 
}
