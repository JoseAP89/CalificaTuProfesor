use sqlx::postgres::Postgres;
use sqlx::Pool;
pub trait Repository {
    fn get_pool(&self) -> Option<&Pool<Postgres>>;
}