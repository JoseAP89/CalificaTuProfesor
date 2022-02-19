pub mod controllers;
pub mod models;
pub mod repositories;
pub mod contracts;
pub mod dtos;
use actix_web::{ web, App, HttpServer, http};
use actix_cors::Cors;
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

        // setting up cors middleware
        let cors = Cors::default()
              .allowed_origin("http://localhost:3000/")
              .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
              .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
              .allowed_header(http::header::CONTENT_TYPE)
              .max_age(3600);

        App::new()
            .wrap(cors)
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