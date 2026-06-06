#!/bin/sh

# This script replaces the placeholders baked into the JS bundle 
# with the actual environment variables provided by Azure Container Apps at runtime.

echo "Replacing environment variables in static files..."

if [ -n "$VITE_API_URL" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" {} +
fi

if [ -n "$VITE_GITHUB_CLIENT_ID" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_GITHUB_CLIENT_ID__|${VITE_GITHUB_CLIENT_ID}|g" {} +
fi

echo "Environment replacement complete."
