# ReMa

A simple application for creating recipes. It can be used for any type of recipe, main courses, cocktails, desserts and many more!

You simply clone the repository and run:
docker compose build --no-cache
docker compose up -d

Open your browser and go to http://localhost:8080/add

#######################################################################################

In case you want to contribute to development, make sure to:

1. change the frontend Dockerfile - comment in the section "For devcontainer" and comment out the rest
2. comment in the volumes sections of backend and frontend in docker-compose.yml and change the ports from 8080:80 to 8080:8080
3. rebuild and reopen in container in vscode (ctrl + shift + P)
4. open your browser and go to http://localhost:8080/add - changes in your code are now reflected at the ui
