use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Error, error};
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use crate::{dtos::UniversityDTO, repositories::universities};
use crate::repositories::universities::universityRepo::UniversityRepo;
use crate::contracts::repository::Repository;
use serde::{Deserialize, Serialize};

async fn getTest() -> Result<String, sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://joseap:J1o2s3e4@localhost/teachers").await?;
    let uni: (String,) = sqlx::query_as("select name from university where LOWER(name) like '%gutierrez%' and LOWER(name) like '%zamora%' limit 1")
        .fetch_one(&pool).await?;
    Ok(uni.0)

}

#[get("/")]
pub async fn hello() -> impl Responder {
    let res = getTest().await;
    match res {
        Ok(r) => HttpResponse::Ok().body(r),
        Err(_) => HttpResponse::Ok().body("Hello world!")
    }
    
}

#[get("/university/one")]
pub async fn get_university_by_id (mut payload: web::Payload) -> Result<HttpResponse, Error> {
    let unirepo = UniversityRepo::new().await;
    let  resp = unirepo.get_by_id(3).await;
    match resp {
        Ok(r) => Ok(HttpResponse::Ok().body(r.name)),
        Err(e) => Err(error::ErrorBadRequest(e))
    }
    
}

#[get("/university/{name}/{num_elements}")]
pub async fn get_university_by_name (payload: web::Path<UniversityDTO>) -> Result<HttpResponse, Error> {
    let name = payload.name.clone();
    let num_el = payload.num_elements.clone();
    let unirepo = UniversityRepo::new().await;
    let  resp = unirepo.get_by_name( name,num_el).await;
    match resp {
        Ok(r) => {
            let universities: Vec<UniversityDTO> = r.into_iter().map(|u| {
                UniversityDTO{
                    name: u.name,
                    university_id: Some(u.university_id),
                    num_elements: num_el
                }
            }).collect();
            Ok(HttpResponse::Ok().json(universities))
        },
        Err(e) => Err(error::ErrorBadRequest(e))
    }
    
}

#[post("/echo")]
pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


pub async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}