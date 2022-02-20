use async_trait::async_trait;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row};
use crate::models::{ SearchNameOperations, Vessel};
use crate::contracts::Repository;

pub struct SearchNameRepository {
    pool: Option<Pool<Postgres>>,
    operations: SearchNameOperations
}


#[async_trait]
impl Repository<Self, Vessel, String> for SearchNameRepository {

    async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await;
        match pool {
            Ok(p) => {
                Self {
                    pool: Some(p),
                    operations: SearchNameOperations::new()
                }
            }
            Err(_) => {
                Self {
                    pool: None,
                    operations: SearchNameOperations::new()
                }

            }
        }

    }

    async fn get_by_id(&self,  table_name: &str,id: i32) -> Result<Vessel, String> {
        match &self.pool {
            Some(p) => {
                let property = self.operations.get_id_command(table_name.to_owned());
                let query = format!("SELECT * FROM {} WHERE {}={} LIMIT 1", table_name, property, id);
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        // map the row into a user-defined domain type
                        let uni = Vessel {
                            id: row.get(0),
                            name: row.get(1),
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

    async fn get_by_name(&self, name: &str, table_name: &str, page_size: i32) -> Result<Vec<Vessel>, String> {
        match &self.pool {
            Some(p) => {
                let name_ = name.to_lowercase().split("+").filter(|x| !x.is_empty()).collect::<Vec<_>>().join(" ");
                let query = format!("SELECT * FROM {2} WHERE LOWER(UNACCENT(name)) LIKE '%{0}%' OR LOWER(name) LIKE '%{0}%' ORDER BY name  LIMIT {1}", name_, page_size, table_name);
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        let uni = Vessel {
                           id: row.get(0),
                            name: row.get(1),
                        };
                        uni
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(uni) => Ok(uni),
                    _ => Err(format!("No existen universidades para la búsqueda ({}). Revise que la palabra este bien escrita.", name))
                }
            },
            None => {
                Err("Hubo un error estableciendo la conexión con la base de datos.".to_owned())

            }
        }

    }

}