# CalificaTuProfesor

Rate your teachers in a safe and anonymous manner while maintaining a secure environment to share your opinions. Evaluate a teacher’s performance with gibberish and rude-word detectors to prevent inappropriate content or comments.


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


# Pages from the application


## Home page

It shows the main search bar to look up your teacher or campus.

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/home-section.png "home-page")


## Teachers page

It shows the global list of teachers from all campuses

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/home-section.png "global-teacher-list-section")


## Add items page

It shows three cards from which you can add a teacher, campus or a university to the system

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/add-items-section.png "add-items-section")


## Our history page

It shows a brief descriotion of the project

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/our-history-section.png "our-history-section")


## Footer page

It shows the footer design

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/footer-section.png "footer-section")

## Teacher Info section

It shows a general descripton of how a specific teacher performance

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/teacher-info-section.png "teacher-info-section")


## Rate teacher section

It shows the format where you rate a teacher, writing a comment about his performance and you grade the specific skill the app chooses to evaluate their performance

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/rate-teacher-section.png "rate-teacher-section")


## Comment teacher section

It shows the looks of the teacher's comment section

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/teacher-comments-section.png "teacher-comments-section")


## Gibberish and Rude words detection

The application has a functionality in which it detects gibberish and rude words in the following scenarios:
    * When rating a teacher in the comment field
    * When editing your commentary over the teacher's comment section
    * When adding the name, first and second lastname of a teacher
    * When adding the name of the campus
    * When adding the name of the university

If the detector finds those kind of words it blocks the process and inform you that those words are not allowed.

![picture alt](https://github.com/JoseAP89/CalificaTuProfesor/blob/main/docs/pictures/gibberish-rude-detector.png "gibberish-rude-detector")

