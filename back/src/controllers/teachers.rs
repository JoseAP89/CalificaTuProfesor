use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Error, error};
use crate::dtos::{RosterDTO, CampusDTO, UniversityDTO};
use crate::repositories::{CampusRepo, UniversityRepo};
use crate::repositories::search_name::search_name_repo::SearchNameRepository;
use crate::contracts::repository_name::RepositoryName;
use crate::repositories::RosterRepo;


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

#[get("/campus/{search}/{num_elements}")]
pub async fn get_campuses_search (params: web::Path<(String, i32)>) -> Result<HttpResponse, Error> {
    let (search,num_elements) = params.into_inner();
    let campus_repo = CampusRepo::new().await;
    let  resp = campus_repo.get_campus_with_uni(search, num_elements).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) =>{
            let e = e;
            Err(error::ErrorTooManyRequests(format!("ERROR:{:?}",e)))
        }
    }
    
}

#[post("/roster")]
pub async fn add_roster(form: web::Json<RosterDTO>) -> Result<HttpResponse, Error> {
    let roster_repo = RosterRepo::new().await;
    let roster = RosterDTO {
        roster_id: None,
        campus_id: form.campus_id,
        teacher_name: form.teacher_name.trim().to_owned(),
        teacher_lastname1: form.teacher_lastname1.trim().to_owned(),
        teacher_lastname2: form.teacher_lastname2.trim().to_owned(),
        subject_name: form.subject_name.trim().to_owned(),
        uni_structure_id: form.uni_structure_id,
        structure_name: form.structure_name.trim().to_owned(),
    };
    let resp = roster_repo.add_roster(roster).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) =>{
            let e = e;
            Err(error::ErrorBadRequest(format!("{:?}",e)))
        }
    }
}

#[post("/campus")]
pub async fn add_campus(form: web::Json<CampusDTO>) -> Result<HttpResponse, Error> {
    let campus_repo = CampusRepo::new().await;
    let campus = CampusDTO {
        campus_id: None,
        name: form.name.trim().to_owned(),
        university_id: form.university_id,
        state_id: form.state_id,
        img_path: form.img_path.to_owned()
    };
    let resp = campus_repo.add_campus(campus).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) =>{
            let e = e;
            Err(error::ErrorBadRequest(format!("{:?}",e)))
        }
    }
}

#[post("/university")]
pub async fn add_university(form: web::Json<UniversityDTO>) -> Result<HttpResponse, Error> {
    let uni_repo = UniversityRepo::new().await;
    let uni = UniversityDTO {
        university_id: None,
        name: form.name.trim().to_owned(),
        img_path: form.img_path.to_owned()
    };
    let resp = uni_repo.add_university(uni).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) =>{
            let e = e;
            Err(error::ErrorBadRequest(format!("{:?}",e)))
        }
    }
}

#[get("/teacher-campus/{search}/{num_elements}")]
pub async fn get_teacher_campus_search (params: web::Path<(String, i32)>) -> Result<HttpResponse, Error> {
    let (search,num_elements) = params.into_inner();
    let roster_repo = RosterRepo::new().await;
    let  resp = roster_repo.get_roster_with_campus(search, num_elements).await;
    match resp {
        Ok(r) => {
            Ok(HttpResponse::Ok().json(r))
        },
        Err(e) =>{
            let e = e;
            Err(error::ErrorTooManyRequests(format!("ERROR:{:?}",e)))
        }
    }
    
}

