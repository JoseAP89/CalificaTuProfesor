use std::time::Duration;
use simplelog::*;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{CampusUniversityDTO, UniversityDTO, CampusDTO};

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
            .max_connections(10)
            .max_lifetime(Duration::new(2,0))
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

    pub async fn add_campus(&self, campus_dto : CampusDTO) -> Result< u64, String> {
        info!(" ** Adding a Campus **");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let resp = match campus_dto.img_path {
                    Some(i) => {
                        sqlx::query!( 
                        r#"INSERT INTO campus(
                            name, university_id, state_id, img_path)
                            values($1, $2, $3, $4)"#,
                        campus_dto.name,
                        campus_dto.university_id,
                        campus_dto.state_id,
                        i.as_bytes())
                        .execute(p).await
                    },
                    None => {
                        sqlx::query!( 
                        r#"INSERT INTO campus(
                            name, university_id, state_id)
                            values($1, $2, $3)"#,
                        campus_dto.name,
                        campus_dto.university_id,
                        campus_dto.state_id)
                        .execute(p).await
                    }
                };
                match resp {
                    Ok(c) => {
                        info!("Added new campus({}) successfully.", campus_dto.name);
                        Ok(c.rows_affected())
                    },
                    Err(e) => {
                        error!("Error: {}", e);
                        Err("Hubó un error al agregar el nuevo campus. Porfavor intentarlo más tarde.".to_owned())
                    }

                }
            },
            Err(e) => {
                error!("Error: {}",e);
                Err("Hubó un error de servidor. Porfavor intentarlo más tarde.".to_owned())
            }
        }

    }

    pub async fn get_campus_with_uni(&self, search: String, num_elements: i32) -> Result<Vec<CampusUniversityDTO>, String> {
        let search = search.to_lowercase().split("+").filter(|x| !x.is_empty()).collect::<Vec<_>>().join(" ");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let query = format!("select c.campus_id, c.name as campus, u.university_id, \
                u.name as uni from campus c join university u on u.university_id=c.university_id \
                WHERE LOWER(UNACCENT(c.name)) LIKE '%{0}%' OR LOWER(c.name) LIKE '%{0}%' \
                ORDER BY c.name LIMIT {1}",
                search, num_elements );
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        let uni = UniversityDTO {
                           university_id: row.get(2),
                            name: row.get(3),
                            img_path: None,
                        };
                        CampusUniversityDTO {
                            campus_id: row.get(0),
                            name: row.get(1),
                            university: uni
                        }
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(c) => Ok(c),
                    Err(e) => {
                        error!("Error: {}",e);
                        Err("Hubo un error obteniendo la información del campus con su universidad.".to_owned())
                    }

                }
            },
            Err(e) => {
                error!("Error: {}",e);
                Err("Hubo un error conectandose a la Base de Datos. Intenta más tarde.".to_owned())
            }
        }

    }

}