use axum::{
    routing::{post},
    Router,
    response::Json,
    extract::Json as ExtractJson,
};
use axum_server::{ContentFilter};
use serde::{Serialize, Deserialize};
use crate::AppState;

#[derive(Serialize)]
struct ApiResponse {
    message: String,
    is_inappropiate: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct FilterRequest {
    words: Vec<String>,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/filter", post(analyze_words))
}

async fn analyze_words(ExtractJson(payload): ExtractJson<FilterRequest>) -> Json<ApiResponse> {
    // Here you would implement your actual filtering logic
    let filtered_words = payload.words.iter()
        .cloned()
        .collect::<Vec<String>>();
    let mut is_inappropiate  = false;
    let filter = ContentFilter::new().unwrap();
    for word in filtered_words  {
        let is_bad = filter.analyze(&word);
        is_inappropiate = is_bad.is_inappropriate;
        if is_inappropiate {
            break; 
        }
    }

    Json(ApiResponse {
        message: match is_inappropiate {
           true => "No podemos procesar la información porque uno o más campos contienen contenido inapropiado. Por favor, modifícalos para continuar.".to_string(),
           _ => "Todos los mensajes son apropiados.".to_string() 
        },
        is_inappropiate: Some(is_inappropiate),
    })
}