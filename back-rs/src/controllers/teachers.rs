use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::postgres::PgPoolOptions;

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

#[post("/echo")]
pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

pub async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}