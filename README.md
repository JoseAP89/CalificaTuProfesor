# CalificaTuProfesor

Califica a tus profesores de tu universidad, colegio o escuela acorde a su desempeño en el aula de clases, de forma anónima y

confiable.

## SETTING UP THE DATABASE (LOCAL)

1. Create the database teachers and then connect to the database with the following commands: 
    `# CREATE DATABASE teachers;` 
    `# \c teachers;`
2. Run the script migrations.sql on psql to create the database and its tables: 
    `# \i migrations.sql`
    You need to be on the root folder where the migrations file is located. If on windows use `# \encoding UTF8` to change to UTF8 encoding and use '/' on the path route. You also need that last code when you connect to teachers database before executing the sql code and before granting all privilages to the joseap user. Another consideration to take is to check the port used to connect to the postgres sql database which should match with the one used on the appsetings file(s).
3. Create the user joseap: `$ create user joseap;`
4. Add a password to the user joseap: `$ alter user joseap with encrypted password 'J1o2s3e4';`
5. Execute the command: `$ GRANT ALL PRIVILEGES ON DATABASE teachers TO joseap;`
6. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO joseap;`
7. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO joseap;`
8. To connect in psql on linux to the database teachers as the user joseap you first off need to connect as postgres: 
    `$ sudo -u postgres psql` 
    On windows: 
    `psql -h localhost -p <PORT> -U joseap teachers`  
    Then: `# \c "host=localhost port=<PORT> dbname=teachers user=joseap password=J1o2s3e4" `


## SETTING UP THE DATABASE (DOCKER)

1. First you need to have installed all your environment set up for Docker, which is different per OS.
2. Run the docker command: `$ docker compose up` to begin downloading the entire application.
3. Find the IDs of all the running containers: `$ docker container ls`.
4. Once all the services are up and running you need to enter the postgresql container: `$ docker exec -it <container-ID> sh`.
5. When you are inside the postgresql container connect to the database: `$ psql -U postgres`.
6. Finally, run the init-db.sh script to setup the database: 
    `$ sh /usr/app/init-db.sh;`
   This script must be run only once when setting up your working environment for the first time.

## Modelo Entidad-Relacion de la BD

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/ER-DB.png "entidad-relacion")
