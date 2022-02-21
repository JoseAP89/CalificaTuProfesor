use std::ops::Deref;

use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{CampusDTO, UniversityDTO};

pub struct CampusRepo {
    pool: Result<Pool<Postgres>, Error>,
}

impl Repository for CampusRepo {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error> {
        self.pool.as_ref()
    }
}

impl CampusRepo {

    pub async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(12)
            .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await;
        match pool {
            Ok(p) => {
                Self {
                    pool: Ok(p),
                }
            }
            Err(e) => {
                Self {
                    pool: Err(e),
                }

            }
        }
    }

    pub async fn get_campus_with_uni(&self, search: String, num_elements: i32) -> Result<Vec<CampusDTO>, String> {
        let search = search.to_lowercase().split("+").filter(|x| !x.is_empty()).collect::<Vec<_>>().join(" ");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
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
                    Ok(c) => Ok(c),
                    Err(e) => {
                        let err = format!("{:?}",e);
                        println!("{}",err);
                        Err(err)
                    }

                }
            },
            Err(e) => {
                let err = format!("{:?}",e);
                println!("{}",err);
                Err(err)
            }
        }

    }

}