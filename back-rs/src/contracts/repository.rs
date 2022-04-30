use sqlx::postgres::Postgres;
use sqlx::{Pool, Error};
pub trait Repository {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error>;
}