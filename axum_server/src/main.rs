use axum::{http::Method, Router};
use tower_http::cors::{CorsLayer, Any};

mod controllers;

// Our shared state (empty in this simple example)
#[derive(Clone)]
pub struct AppState {}

#[tokio::main]
async fn main() {
    // Create CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any) // Allows all origins
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE]) // Allows all HTTP methods
        .allow_headers(Any); // Allows all headers
    // Initialize shared state
    let shared_state = AppState {};

    // Build our application with routes from controllers
    let app = Router::new()
        .merge(controllers::word_filtering_controller::router())
        .layer(cors)
        .with_state(shared_state);

    // Run the server
    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}