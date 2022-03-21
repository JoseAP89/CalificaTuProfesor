use std::time::Duration;
use simplelog::*;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row ,Error};
use crate::contracts::{ Repository};
use crate::dtos::{CampusUniversityDTO, UniversityDTO, CampusDTO};
use crate::models::Vessel;

pub struct UniStructureRepo {
    pool: Result<Pool<Postgres>, Error>,
}

impl Repository for UniStructureRepo {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error> {
        self.pool.as_ref()
    }
}

impl UniStructureRepo {

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

    pub async fn get_uni_structures(&self) -> Result<Vec<Vessel>, String> {
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let query = format!("SELECT uni_structure_id, name \
                FROM uni_structure ORDER BY name ");
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        Vessel {
                            id: row.get(0),
                            name: row.get(1),
                        }
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(c) => Ok(c),
                    Err(e) => {
                        error!("Error: {}",e);
                        Err("Hubo un error obteniendo la información de la esturctura universitaria.".to_owned())
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