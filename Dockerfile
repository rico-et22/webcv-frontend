# Stage 1: Build the Vite application
FROM node:22-alpine AS builder

# Install pnpm (matching your local version)
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application
COPY . .

# Inject placeholders for environment variables so they can be replaced at runtime
ENV VITE_API_URL=__VITE_API_URL__
ENV VITE_GITHUB_CLIENT_ID=__VITE_GITHUB_CLIENT_ID__

# Build the application
RUN pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the runtime environment variable replacer script
COPY env-replace.sh /docker-entrypoint.d/99-env-replace.sh
RUN chmod +x /docker-entrypoint.d/99-env-replace.sh

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
