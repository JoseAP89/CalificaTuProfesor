use std::time::Duration;
use simplelog::*;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{CampusDTO, UniversityDTO};

pub struct UniversityRepo {
    pool: Result<Pool<Postgres>, Error>,
}

impl Repository for UniversityRepo {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error> {
        self.pool.as_ref()
    }
}

impl UniversityRepo {

    pub async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .max_lifetime(Duration::new(3,0))
            .connect_timeout(Duration::new(3,0))
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


    pub async fn add_university(&self, university_dto : UniversityDTO) -> Result< u64, String> {
        info!(" ** Adding a University **");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let resp = match university_dto.img_path {
                    Some(i) => {
                        sqlx::query!( 
                        r#"INSERT INTO university(
                            name, img_path)
                            values($1, $2)"#,
                        university_dto.name,
                        i.as_bytes())
                        .execute(p).await

                    },
                    None => {
                        sqlx::query!( 
                        r#"INSERT INTO university(
                            name)
                            values($1)"#,
                        university_dto.name)
                        .execute(p).await
                    }
                };
                match resp {
                    Ok(c) => {
                        info!("Added new university({}) successfully.", university_dto.name);
                        Ok(c.rows_affected())
                    },
                    Err(e) => {
                        error!("Error: {}", e);
                        Err("Hubó un error al agregar la nueva universidad. Porfavor intentarlo más tarde.".to_owned())
                    }

                }
            },
            Err(e) => {
                error!("Error: {}",e);
                Err("Hubó un error de servidor. Porfavor intentarlo más tarde.".to_owned())
            }
        }

    }


}