use async_trait::async_trait;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row};
use crate::models::University;
use sqlx::types::chrono::{DateTime, Utc};

#[async_trait]
pub trait Repository<T,E> {
    async fn get_by_id(&self, id: i32) -> Result<T,E>; 
}

pub struct UniversityRepo {
    pool: Option<Pool<Postgres>>,
}

impl UniversityRepo {
    pub async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await;
        match pool {
            Ok(p) => {
                Self {
                    pool: Some(p)
                }
            }
            Err(e) => {
                Self {
                    pool: None
                }

            }
        }

    }
}

#[async_trait]
impl Repository<University, String> for UniversityRepo {

    async fn get_by_id(&self, id: i32) -> Result<University, String> {
        match &self.pool {
            Some(p) => {
                let resp = sqlx::query("SELECT * FROM university WHERE universityID=$1 LIMIT 1")
                    .bind(id)
                    .map(|row: PgRow| {
                        // map the row into a user-defined domain type
                        let uni = University {
                            university_id: row.get(0),
                            name: row.get(1),
                            created_at: Utc::now(),
                            modified_at: Utc::now()
                        };
                        uni
                    })
                    .fetch_one(p).await;
                match resp {
                    Ok(uni) => Ok(uni),
                    _ => Err(format!("No existe la universidad con id({})", id))
                }
            },
            None => {
                Err("Hubo un error estableciendo la conexión con la base de datos.".to_owned())

            }
        }
    }
}