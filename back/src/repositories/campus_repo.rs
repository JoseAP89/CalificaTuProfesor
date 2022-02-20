use async_trait::async_trait;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row};
use crate::contracts::{ Repository};
use crate::dtos::{CampusDTO, UniversityDTO};

pub struct CampusRepo {
    pool: Option<Pool<Postgres>>,
}

impl Repository for CampusRepo {
    fn get_pool(&self) -> Option<&Pool<Postgres>> {
        self.pool.as_ref()
    }
}

impl CampusRepo {

    pub async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await;
        match pool {
            Ok(p) => {
                Self {
                    pool: Some(p),
                }
            }
            Err(_) => {
                Self {
                    pool: None,
                }

            }
        }
    }

    pub async fn get_campus_with_uni(&self, search: String, num_elements: i32) -> Option<Vec<CampusDTO>> {
        let pool = self.get_pool();
        match pool {
            Some(p) => {
                let query = format!("select c.campus_id, c.name as campus, u.university_id, u.name as uni from campus c join university u on u.university_id=c.university_id WHERE LOWER(UNACCENT(c.name)) LIKE '%{0}%' OR LOWER(c.name) LIKE '%{0}%' ORDER BY c.name LIMIT {1}",
                search, num_elements );
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        let uni = UniversityDTO {
                           university_id: row.get(2),
                            name: row.get(3),
                        };
                        CampusDTO {
                            campus_id: row.get(0),
                            name: row.get(1),
                            university: uni
                        }
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(c) => Some(c),
                    _ => None
                }

            }
            _ => None
        }

    }

}