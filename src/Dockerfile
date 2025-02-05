# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# launch stage
FROM nginx:stable-alpine as launch-stage
# Add nginx config
#COPY nginx.conf /temp/nginx.conf
# Copy dist folder
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
