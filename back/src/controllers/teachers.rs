use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Error, error};
use sqlx::postgres::PgPoolOptions;
use crate::repositories::CampusRepo;
use crate::{dtos::UniversityDTO};
use crate::repositories::search_name::search_name_repo::SearchNameRepository;
use crate::contracts::repository_name::RepositoryName;

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

// table must have property name
#[get("/search-id/{table_name}/{table_name_id}")]
pub async fn get_table_name_by_id(params: web::Path<(String, i32)>) -> Result<HttpResponse, Error> {
    let (table_name, table_name_id) = params.into_inner();
    let unirepo = SearchNameRepository::new().await;
    if table_name_id < 1 {
        return Err(error::ErrorBadRequest("No existen universidades con ese ID."));
    }
    let  resp = unirepo.get_by_id(&table_name,table_name_id).await;
    match resp {
        Ok(r) => Ok(HttpResponse::Ok().json(r)),
        Err(e) => Err(error::ErrorBadRequest(e))
    }
    
}

// table must have property name
#[get("/search-name/{table_name}/{name}/{num_elements}")]
pub async fn get_table_name_by_name (params: web::Path<(String, String, i32)>) -> Result<HttpResponse, Error> {
    let (table_name, name, num_elements) = params.into_inner();
    let unirepo = SearchNameRepository::new().await;
    let  resp = unirepo.get_by_name( &name,&table_name,num_elements).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) => Err(error::ErrorBadRequest(e))
    }
    
}

// table must have property name
#[get("/campus/{search}/{num_elements}")]
pub async fn get_campuses_search (params: web::Path<(String, i32)>) -> Result<HttpResponse, Error> {
    let (search,num_elements) = params.into_inner();
    let campus_repo = CampusRepo::new().await;
    let  resp = campus_repo.get_campus_with_uni(search, num_elements).await;
    match resp {
        Some(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        None =>{
            let e = "No hay resultados para la búsqueda.";
            Err(error::ErrorBadRequest(e))
        }
    }
    
}

#[post("/echo")]
pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


pub async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}