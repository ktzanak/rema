# ReMa - backend

This is the backend service of ReMa connected to mysql db.

1. You can use docker exec -it rema-mysql-container mysql -u root -p for connecting to the mysql database inside the container. The password of the database is the same password you gave in the .env file for DB_PASSWORD variable.
2. You can also use docker exec -it rema-backend-container to connect to the backend container during runtime.
