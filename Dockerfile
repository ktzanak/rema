# Option 1 with nginx
# Build stage
#FROM node:lts-alpine as build-stage
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build

# Run stage
#FROM nginx:stable-alpine as launch-stage
# Add nginx config
#COPY nginx.conf /temp/nginx.conf
# Copy dist folder
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Option 2 without nginx
# Build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:lts-alpine AS lunch-stage
WORKDIR /app
# Install serve to serve the static files
RUN npm install -g serve
# Copy the build output from the previous stage
COPY --from=build-stage /app/dist .
COPY --from=build-stage /app/images ./images
EXPOSE 8080
CMD ["serve", "-s", ".", "-l", "8080"]


#At some point upgrade everything in package.json and generally upgrade react
#npm install -g npm-check-updates
#ncu -u
#npm install
