use std::time::Duration;

use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{CampusDTO, UniversityDTO, RosterDTO};

pub struct RosterRepo {
    pool: Result<Pool<Postgres>, Error>,
}

impl Repository for RosterRepo {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error> {
        self.pool.as_ref()
    }
}

impl RosterRepo {

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

    pub async fn add_roster(&self, roster_dto: RosterDTO) -> Result<u64, String> {
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let resp = sqlx::query!( 
                    r#"INSERT INTO roster(
                        campus_id, teacher_name, teacher_lastname1, teacher_lastname2, subject_name, uni_structure_id, structure_name)
                        values($1, $2, $3, $4, $5, $6, $7)"#,
                    roster_dto.campus_id,
                    roster_dto.teacher_name,
                    roster_dto.teacher_lastname1,
                    roster_dto.teacher_lastname2,
                    roster_dto.subject_name,
                    roster_dto.uni_structure_id,
                    roster_dto.structure_name)
                    .execute(p).await;
                match resp {
                    Ok(c) => Ok(c.rows_affected()),
                    Err(e) => {
                        let err = format!("{:?}",e);
                        println!("Error adding roster: {}",err);
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