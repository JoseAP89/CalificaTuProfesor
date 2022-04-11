extern crate simplelog;
use simplelog::*;
use std::fs::OpenOptions;
pub mod controllers;
pub mod models;
pub mod repositories;
pub mod contracts;
pub mod dtos;
use actix_web::{  App, HttpServer, http, web};
use actix_cors::Cors;
pub use self::controllers::{
    get_table_name_by_id,
    get_table_name_by_name,
    get_campuses_search,
    add_roster,
    add_campus,
    add_university,
    get_teacher_campus_search,
    get_uni_structure,
};


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let addr = "127.0.0.1:8080";
    println!("running in addr: {}", addr);
    // logger
    let mut conf_logger = ConfigBuilder::new();
    conf_logger.set_time_to_local(true);
    conf_logger.set_time_format("%a/%d/%m/%YT%H:%M".to_owned());
    CombinedLogger::init(
        vec![
            TermLogger::new(LevelFilter::Warn, conf_logger.build(), TerminalMode::Mixed, ColorChoice::Auto),
            WriteLogger::new(LevelFilter::Info, conf_logger.build(), 
                OpenOptions::new()
                    .write(true)
                    .append(true)
                    .open("/home/joseap/Documents/projects/logs/teachers.log")
                    .unwrap()
            ),
        ]
    ).unwrap();
    info!("** Teacher App is starting **");

    HttpServer::new(|| {

        // setting up cors middleware
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(web::PayloadConfig::new(50_242_880))
            .service(get_table_name_by_id)
            .service(get_table_name_by_name)
            .service(get_campuses_search)
            .service(add_roster)
            .service(add_campus)
            .service(add_university)
            .service(get_teacher_campus_search)
            .service(get_uni_structure)
            .wrap(cors)
    })
    .bind(addr)?
    .run()
    .await


}