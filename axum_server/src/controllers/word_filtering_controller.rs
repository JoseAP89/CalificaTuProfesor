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
struct AxumApiResponse {
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

async fn analyze_words(ExtractJson(payload): ExtractJson<FilterRequest>) -> Json<AxumApiResponse> {
    // Here you would implement your actual filtering logic
    let filtered_words = payload.words.iter()
        .cloned()
        .collect::<Vec<String>>();
    let mut is_inappropiate  = false;
    let filter = ContentFilter::new().unwrap();
    let mut motive = "";
    for word in filtered_words  {
        let is_bad = filter.analyze(&word);
        is_inappropiate = is_bad.is_inappropriate;
        if is_inappropiate {
            if is_bad.vulgar_words_found {
                motive = "Motivo: Contenido vulgar.";
            }
            if is_bad.gibberish_detected {
                motive = "Motivo: Contenido sin sentido.";
            }
            break; 
        }
    }
    Json(AxumApiResponse {
        message: match is_inappropiate {
           true => format!("No podemos procesar la información porque uno o más campos contienen contenido inapropiado. Por favor, modifícalos para continuar. {}", motive).to_string(),
           _ => "Todos los mensajes son apropiados.".to_string() 
        },
        is_inappropiate: Some(is_inappropiate),
    })
}