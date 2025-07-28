# ReMa

A simple React application for creating recipes. <br>
It can be used for any type of recipe, main courses, cocktails, desserts and many more!

1. Clone the repository
2. Copy-paste the .env.dev to .env and edit it by setting `SQL_SCRIPT= absolute path of the createtables.sql`
3. In case you have an OPENAI_API_KEY you can also include it in the .env and activate the AI feature of rema.
4. Simply run:<br>
   docker compose build --no-cache<br>
   docker compose up -d

Open your browser and go to http://localhost:8080/add

#######################################################################################

In case you want to contribute to development, make sure to:

1. change the Dockerfile of the frontend service - uncomment the section "For development" and comment the section "For production"
2. uncomment the volumes sections of backend and frontend in docker-compose.yml and change the ports from 8080:80 to 8080:8080
3. rebuild and reopen in container in vscode (ctrl + shift + P)
4. open your browser and go to http://localhost:8080/add - changes in your code are now reflected at the ui
