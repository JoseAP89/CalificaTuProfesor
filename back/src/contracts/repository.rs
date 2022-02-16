use async_trait::async_trait;

#[async_trait]
pub trait Repository<R,T,E> {
    async fn new() -> R;
    async fn get_by_id(&self, table_name: &str ,id: i32) -> Result<T,E>; 
    async fn get_by_name(&self, name: &str, table_name: &str, page_size: i32) -> Result<Vec<T>,E>;
}
