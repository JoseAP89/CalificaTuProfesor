use std::time::Duration;
use simplelog::*;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{RosterDTO, TeacherCampusDTO, CampusDTO};

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
        info!(" ** Adding a Roster **");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let resp = sqlx::query!( 
                    r#"INSERT INTO roster(
                        campus_id, teacher_name, teacher_lastname1, teacher_lastname2, subject_name, uni_structure_id, structure_name)
                        values($1, $2, $3, $4, $5, $6, $7)"#,
                    roster_dto.campus_id,
                    roster_dto.teacher_name.to_uppercase(),
                    roster_dto.teacher_lastname1.to_uppercase(),
                    roster_dto.teacher_lastname2.to_uppercase(),
                    roster_dto.subject_name.to_uppercase(),
                    roster_dto.uni_structure_id,
                    roster_dto.structure_name.to_uppercase())
                    .execute(p).await;
                match resp {
                    Ok(c) => {
                        let fullname = format!("{} {} {}",roster_dto.teacher_name,
                            roster_dto.teacher_lastname1, roster_dto.teacher_lastname2);
                        info!("Added new roster({}) successfully.", fullname);
                        Ok(c.rows_affected())
                    },
                    Err(e) => {
                        error!("Error: {}", e);
                        Err("Hubó un error al agregar el nuevo roster. Porfavor intentarlo más tarde.".to_owned())
                    }

                }
            },
            Err(e) => {
                error!("Error: {}",e);
                Err("Hubó un error de servidor. Porfavor intentarlo más tarde.".to_owned())
            }
        }

    }

    pub async fn get_roster_with_campus(&self, search: String, num_elements: i32) -> Result<Vec<TeacherCampusDTO>, String> {
        let search = search.to_lowercase().split("+").filter(|x| !x.is_empty()).collect::<Vec<_>>().join(" ");
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let query = format!("SELECT r.roster_id, r.teacher_name, r.teacher_lastname1, \
                    r.teacher_lastname2, r.subject_name, c.campus_id, c.name, c.university_id, c.state_id \
                    FROM roster r \
                    JOIN campus c ON c.campus_id = r.campus_id \
                    WHERE LOWER(UNACCENT(CONCAT(r.teacher_name,' ',r.teacher_lastname1,' ',r.teacher_lastname2))) LIKE '%{0}%' OR  \
                    LOWER(CONCAT(r.teacher_name,' ',r.teacher_lastname1,' ',r.teacher_lastname2)) LIKE '%{0}%' \
                    ORDER BY r.teacher_name, c.name LIMIT {1}",
                search, num_elements );
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        let campus = CampusDTO {
                            campus_id: Some(row.get(5)),
                            name: row.get(6),
                            university_id : row.get(7),
                            state_id : row.get(8),
                            img_file: None,
                            img_type: None
                        };
                        TeacherCampusDTO {
                            roster_id: row.get(0),
                            teacher_name: row.get(1),
                            teacher_lastname1: row.get(2),
                            teacher_lastname2:  match row.try_get(3){
                                Ok(t) => Some(t),
                                _ => None
                            },
                            campus,
                            subject_name: row.get(4),
                        }
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(c) => Ok(c),
                    Err(e) => {
                        error!("Error: {}",e);
                        Err("Hubo un error obteniendo la información del profesor con su campus.".to_owned())
                    }

                }
            },
            Err(e) => {
                error!("Error: {}",e);
                Err("Hubo un error conectandose a la Base de Datos. Intenta más tarde.".to_owned())
            }
        }

    }

    fn to_capitalize(word: &str) -> String {
        let word = word.trim().to_lowercase();
        let mut res = String::new();
        let mut space = false;
        for c in word.chars().enumerate() {
            if c.1 == ' ' {
                space = true;
            }
            if c.0 == 0 {
                res.push(c.1.to_uppercase().last().unwrap());
            } else if space && c.1!=' ' {
                res.push(c.1.to_uppercase().last().unwrap());
                space = false;
            } else {
                res.push(c.1.to_lowercase().last().unwrap());
            }
        }
        res
    }

}