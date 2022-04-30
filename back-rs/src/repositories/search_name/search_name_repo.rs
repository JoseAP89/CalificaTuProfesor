use async_trait::async_trait;
use sqlx::postgres::{PgPoolOptions, Postgres, PgRow};
use sqlx::{Pool, Row, Error};
use crate::models::{ SearchNameOperations, Vessel};
use crate::contracts::{RepositoryName, Repository};

pub struct SearchNameRepository {
    pool: Result<Pool<Postgres>, Error>,
    operations: SearchNameOperations
}

impl Repository for SearchNameRepository {
    fn get_pool(&self) -> Result<&Pool<Postgres>, &Error> {
        self.pool.as_ref()
    }
}

#[async_trait]
impl RepositoryName<Self, Vessel, String> for SearchNameRepository {

    async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await;
        match pool {
            Ok(p) => {
                Self {
                    pool: Ok(p),
                    operations: SearchNameOperations::new()
                }
            }
            Err(e) => {
                Self {
                    pool: Err(e),
                    operations: SearchNameOperations::new()
                }

            }
        }

    }

    async fn get_by_id(&self,  table_name: &str,id: i32) -> Result<Vessel, String> {
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let property = self.operations.get_id_command(table_name.to_owned());
                let query = format!("SELECT * FROM {} WHERE {}={} LIMIT 1", table_name, property, id);
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        // map the row into a user-defined domain type
                        let uni = Vessel {
                            id: row.get(0),
                            value: row.get(1),
                        };
                        uni
                    })
                    .fetch_one(p).await;
                match resp {
                    Ok(uni) => Ok(uni),
                    _ => Err(format!("No existe la universidad con id({})", id))
                }
            },
            Err(e) => {
                let err = format!("{:?}",e);
                println!("{}",err);
                Err("Hubo un error estableciendo la conexión con la base de datos.".to_owned())

            }
        }
    }

    async fn get_by_name(&self, name: &str, table_name: &str, page_size: i32) -> Result<Vec<Vessel>, String> {
        let pool = self.get_pool();
        match pool {
            Ok(p) => {
                let name_ = name.to_lowercase().split("+").filter(|x| !x.is_empty()).collect::<Vec<_>>().join(" ");
                let query = format!("SELECT * FROM {2} WHERE LOWER(UNACCENT(name)) LIKE '%{0}%' OR LOWER(name) LIKE '%{0}%' ORDER BY name  LIMIT {1}", name_, page_size, table_name);
                let resp = sqlx::query(&query)
                    .map(|row: PgRow| {
                        let uni = Vessel {
                           id: row.get(0),
                            value: row.get(1),
                        };
                        uni
                    })
                    .fetch_all(p).await;
                match resp {
                    Ok(uni) => Ok(uni),
                    Err(e) => Err(format!("{:?}", e))
                }
            },
            Err(e) => {
                let err = format!("{:?}",e);
                println!("{}",err);
                Err("Hubo un error estableciendo la conexión con la base de datos.".to_owned())

            }
        }

    }

}