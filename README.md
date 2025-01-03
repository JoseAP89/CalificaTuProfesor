# CalificaTuProfesor

Califica a tus profesores de tu universidad, colegio o escuela acorde a su desempeño en el aula de clases, de forma anónima y
confiable.

## SETTING UP THE DATABASE
## Modelo Entidad-Relacion de la BD

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/ER-DB.png "entidad-relacion")

0. Create the database teacers and then connect to the database with the following commands:
    `# CREATE DATABASE teachers;`
    `# \c teachers;`
1. Run the script migrations.sql on psql to create the database and its tables: `# \i migrations.sql`. You need to be on the root folder where 
the migrations file is located. If on windows use `# \encoding UTF8` to change to UTF encoding and use '/' on the path route. 
You also need that last code when you connect to teachers database before executing the sql code and before 
granting all privilages to the joseap user. Another consideration to take is to check the port used to connect to the postgres sql  database which 
should match with the one used on the appsetings file(s).
2. Create the user joseap: `$ create user joseap;`
3. Add a password to the user joseap: `$ alter user joseap with encrypted password 'J1o2s3e4';`
4. Execute the command: `$ GRANT ALL PRIVILEGES ON DATABASE teachers TO joseap;`
5. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO joseap;`
6. Execute the command: `$ GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO joseap;`
7. To connect in psql on linux to the database teachers as the user joseap you first off need to connect as postgres: 
 `$ sudo -u postgres psql`, on windows: 
 `psql -h localhost -p <PORT> -U joseap teachers` then: 
 `# \c "host=localhost port=<PORT> dbname=teachers user=joseap password=J1o2s3e4"`
