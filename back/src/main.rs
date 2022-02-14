pub mod controllers;
use sqlx::postgres::PgPoolOptions;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
pub use self::controllers::{
    manual_hello,
    echo,
    hello
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await


}