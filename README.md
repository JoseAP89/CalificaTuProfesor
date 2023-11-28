# CalificaTuProfesor

Califica a tus profesores de tu universidad, colegio o escuela acorde a su desempeño en el aula de clases, de forma anónima y
confiable.

## Modelo Entidad-Relacion de la BD

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/ER-DB.png "entidad-relacion")

## SETTING UP THE DATABASE

1. Run the script migrations.sql on psql to create the database and its tables
2. Create the user joseap: `$ create user joseap;`
3. Add a password to the user joseap: `$ alter user joseap with encrypted password 'J1o2s3e4';`
4. Execute the command: `$ GRANT ALL PRIVILEGES ON DATABASE teachers TO joseap;`
5. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO joseap;`
6. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO joseap;`

