# CalificaTuProfesor

Califica a tus profesores de tu universidad, colegio o escuela acorde a su desempeño en el aula de clases, de forma anónima y
confiable.

## SETTING UP THE DATABASE

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
