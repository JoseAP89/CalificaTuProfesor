FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install -g @angular/cli && \
    npm install

# Copy all source files
COPY . .

# Build the Angular app in production mode
RUN npm run build -- --configuration production

# Final stage - for serving the built files (optional)
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Copy nginx config (if you have custom one)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx starts automatically by the base image