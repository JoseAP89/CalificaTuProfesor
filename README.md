# CalificaTuProfesor

Califica a tus profesores de tu universidad, colegio o escuela acorde a su desempeño en el aula de clases, de forma anónima y
confiable.

## SETTING UP THE DATABASE
## Modelo Entidad-Relacion de la BD

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/ER-DB.png "entidad-relacion")

1. First you need to have installed all your environment set up for Docker, which is different per OS.
2. Run the docker command: `$ docker compose up` to begin downloading the entire application.
3. Once all the services are up and running you need to enter the postgresql container: `$ docker exec -it <conteiner-ID> sh`.
4. When you are inside the postgresql container connect to the database: `$ psql -U postgres`.
5. Run the following commands once when setting up your environment for the first time:
    `# CREATE DATABASE teachers;`
    `# \c teachers;`
    `# \i /usr/app/scripts/migrations.sql;`
6. To verify that everything is working fine run: `# SELECT * FROM university limit 10;`. If you get results then
the installation of the DB is complete.
7. Finally, create the user that will be used for the .NET service: 
    `$ create user joseap;`
    `$ alter user joseap with encrypted password 'J1o2s3e4';`
    `$ GRANT ALL PRIVILEGES ON DATABASE teachers TO joseap;`
    `$ GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO joseap;`
    `$ GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO joseap;`