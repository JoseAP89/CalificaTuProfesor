# Builder stage
FROM rustlang/rust:nightly as builder

WORKDIR /app

# First copy only the files needed for dependency resolution
COPY Cargo.toml Cargo.lock ./

# Create dummy source files if they don't exist
RUN mkdir -p src && \
    if [ ! -f src/main.rs ]; then \
      echo 'fn main() {}' > src/main.rs; \
    fi && \
    cargo fetch

# Now copy the rest of the files
COPY . .

# Build the application
RUN cargo build --release && \
    strip target/release/axum_server

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/axum_server .

RUN useradd -m appuser && \
    chown appuser:appuser axum_server
USER appuser

EXPOSE 3000
CMD ["./axum_server"]