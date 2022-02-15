pub mod controllers;
pub mod models;
pub mod repositories;
pub mod contracts;
use sqlx::postgres::PgPoolOptions;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
pub use self::controllers::{
    manual_hello,
    echo,
    hello,
    get_university_by_id
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .service(get_university_by_id)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await


}