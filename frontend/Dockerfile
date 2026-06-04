# Build stage
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production runtime stage (if serving via standalone nginx, though we use the main nginx proxy here)
# For local dev we just use 'npm run dev', but for prod orchestrations we output the build folder.
# Since docker-compose routes via nginx, we just need this container to build the assets.
# But to keep a running container for dev mode if needed:
CMD ["npm", "run", "dev", "--", "--host"]

# Note: In a pure production setup without the main nginx container, we would do:
# FROM nginx:alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
