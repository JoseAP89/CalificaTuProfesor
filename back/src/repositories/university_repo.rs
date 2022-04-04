extern crate base64;
use std::path::Path;
use std::fs::File;
use std::io::prelude::*;
use base64::decode;
use std::time::Duration;
use simplelog::*;
use sqlx::postgres::{PgPoolOptions, Postgres};
use sqlx::{Pool, Error};
use crate::contracts::{ Repository};
use crate::dtos::{UniversityDTO};

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
                let resp =  sqlx::query!( 
                    r#"INSERT INTO university(
                        name)
                        values($1)"#,
                    university_dto.name)
                    .execute(p).await;
                match resp {
                    Ok(c) => {
                        info!("Added new university({}) successfully.", university_dto.name);
                        match university_dto.img_file {
                            Some(f) => {
                                let binary_file_resp = decode(&f);
                                //if let Ok(file_b) = binary_file_resp {
                                match binary_file_resp {
                                    Ok(file_b) => {
                                        let path = Path::new("/home/joseap/Documents/projects/CalificaTuProfesor/front/public/universities/");
                                        let mut file_name = university_dto.name
                                            .split(" ")
                                            .filter(|&x| x != " " && x!="")
                                            .collect::<Vec<&str>>()
                                            .join("_");
                                        file_name = path.display().to_string() + &file_name.to_lowercase() +
                                            "." + &university_dto.img_type.unwrap();
                                        let file = File::create(file_name);
                                        match file {
                                            Ok(mut file_res) => {
                                                info!("Added new image for university '{}' successfully.", university_dto.name);
                                                file_res.write_all(&file_b).unwrap_or_default()
                                            },
                                            Err(e) => error!("There was a problem creating the file: {}", e)
                                        }
                                    },
                                    Err(e) => {
                                        error!("There was a problem decoding the base64 file format: {}", e)
                                    }
                                }
                            },
                            _ => ()
                        }
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