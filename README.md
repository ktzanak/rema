# ReMa

## How to use

A simple React application for creating recipes. <br>
It can be used for any type of recipe, main courses, cocktails, desserts and many more!

1. Clone the repository (master or develop)
2. Copy-paste the .env.dev to .env and edit it by setting `SQL_SCRIPT= <absolute path of the createtables.sql>`
3. In case you have an OPENAI_API_KEY you can also include it in the .env and get healthier versions of your recipes using the AI feature.
4. Simply run:<br>
   docker compose build --no-cache<br>
   docker compose up -d

Open your browser and go to http://localhost:8080/add

## How to contribute

In case you want to contribute to development, make sure to:

1. change the Dockerfile of the frontend service - uncomment the section "For development" and comment the section "For production"
2. change the Dockerfile of the backend service - uncomment the section "For development" and comment the section "For production"
3. change the docker-compose.yml - uncomment the volumes sections of backend and frontend and change the ports of the frontend service from 8080:80 to 8080:8080
4. rebuild and reopen in container in vscode (ctrl + shift + P)
5. open your browser and go to http://localhost:8080/ - changes in your code are now reflected at the ui

## License

This project is licensed under a modified MIT License with a Non-Commercial clause.
