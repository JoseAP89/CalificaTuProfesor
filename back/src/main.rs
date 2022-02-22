pub mod controllers;
pub mod models;
pub mod repositories;
pub mod contracts;
pub mod dtos;
use actix_web::{  App, HttpServer, http};
use actix_cors::Cors;
pub use self::controllers::{
    get_table_name_by_id,
    get_table_name_by_name,
    get_campuses_search,
    add_roster,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let addr = "127.0.0.1:8080";
    println!("running in addr: {}", addr);
    HttpServer::new(|| {

        // setting up cors middleware
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .service(get_table_name_by_id)
            .service(get_table_name_by_name)
            .service(get_campuses_search)
            .service(add_roster)
            .wrap(cors)
    })
    .bind(addr)?
    .run()
    .await


}