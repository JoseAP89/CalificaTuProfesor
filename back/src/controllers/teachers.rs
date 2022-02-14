use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::postgres::PgPoolOptions;
use crate::repositories::universities::universityRepo::Repository;
use crate::repositories::universities::universityRepo::UniversityRepo;

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

#[get("/university")]
pub async fn get_university_by_id() -> impl Responder {
    let unirepo = UniversityRepo::new().await;
    let res = getTest().await;
    let  resp = unirepo.get_by_id(3).await;
    match resp {
        Ok(r) => HttpResponse::Ok().body(r.name),
        Err(e) => HttpResponse::Ok().body(e)
    }
    
}

#[post("/echo")]
pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

pub async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}