# For production
# Build stage
FROM node:lts-alpine AS build-stage
RUN set -ex && \
    apk add --no-cache \
    bash \
    curl \
    openssh-client \
    git
WORKDIR /app/rema-frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM nginx:stable-alpine AS launch-stage
# Add nginx config
COPY nginx.conf /temp/nginx.conf
RUN envsubst /app < /temp/nginx.conf > /etc/nginx/conf.d/default.conf
# Copy dist folder
COPY --from=build-stage /app/rema-frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

#For development
#FROM node:lts-alpine
#RUN apk add --no-cache bash curl openssh-client git
#WORKDIR /app/rema-frontend
#COPY package*.json ./
#RUN npm install
#COPY . .
#EXPOSE 8080
#USER node
#CMD ["npm", "run", "dev"]
