# --- Stage 1: Build the Vite app ---
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies (no dev cache pollution)
RUN npm ci

# Copy rest of the source code (excluding node_modules via .dockerignore)
COPY . .

# Build the app for production
RUN npm run build


# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
