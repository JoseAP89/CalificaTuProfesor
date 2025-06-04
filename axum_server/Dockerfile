# axum_server/Dockerfile

FROM rust:1.77 as builder

WORKDIR /app
COPY . .

# Cache dependencies
RUN cargo fetch

# Compile the app
RUN cargo build --release

# ---

FROM debian:buster-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/target/release/axum_server /app/axum_server

EXPOSE 3000
CMD ["./axum_server"]

