pub mod controllers;
pub mod models;
pub mod repositories;
pub mod contracts;
pub mod dtos;
use sqlx::postgres::PgPoolOptions;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
pub use self::controllers::{
    manual_hello,
    echo,
    hello,
    get_table_name_by_id,
    get_table_name_by_name
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .service(get_table_name_by_id)
            .service(get_table_name_by_name)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await


}