use axum::{Router};
use tower_http::cors::{CorsLayer, Any};
use std::net::SocketAddr;

mod controllers;

// Our shared state (empty in this simple example)
#[derive(Clone)]
pub struct AppState {}

#[tokio::main]
async fn main() {
    // Create CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any) // Allows all origins
        .allow_methods(Any) // Allows all HTTP methods
        .allow_headers(Any); // Allows all headers
    // Initialize shared state
    let shared_state = AppState {};

    // Build our application with routes from controllers
    let app = Router::new()
        .merge(controllers::word_filtering_controller::router())
        .layer(cors)
        .with_state(shared_state);

    // Run the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server listening on {}", addr);
    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}