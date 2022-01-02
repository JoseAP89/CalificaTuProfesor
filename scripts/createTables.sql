DROP TABLE IF EXISTS grade; 
DROP TABLE IF EXISTS scale; 
DROP TABLE IF EXISTS vote; 
DROP TABLE IF EXISTS comment; 
DROP TABLE IF EXISTS roster; 
DROP TABLE IF EXISTS campus; 
DROP TABLE IF EXISTS state; 
DROP TABLE IF EXISTS university; 
DROP TABLE IF EXISTS teacher; 

CREATE TABLE state (
    StateID SERIAL PRIMARY KEY,
    Name varchar(80),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP
);

CREATE TABLE university (
    UniversityID SERIAL PRIMARY KEY,
    Name varchar(250),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP
);

CREATE TABLE campus (
    CampusID SERIAL PRIMARY KEY,
    Name varchar(250),
    UniversityID int NOT NULL,
    StateID int NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP,
    FOREIGN KEY (UniversityID)
        REFERENCES university (UniversityID),
    FOREIGN KEY (StateID)
        REFERENCES state (StateID)
);

CREATE TABLE teacher (
    TeacherID SERIAL PRIMARY KEY,
    Name varchar(250),
    FirstLastName varchar(250),
    SecondLastName varchar(250),
    FullName varchar(250),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP
);

CREATE TABLE roster (
    RosterID SERIAL PRIMARY KEY,
    CampusID int NOT NULL,
    TeacherID int NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP,
    FOREIGN KEY (CampusID)
        REFERENCES campus (CampusID),
    FOREIGN KEY (TeacherID)
        REFERENCES teacher (TeacherID)
);

CREATE TABLE comment (
    CommentID SERIAL PRIMARY KEY,
    RosterID int NOT NULL,
    Comment varchar(250) NOT NULL,
    OwnerIP varchar(20),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP,
    FOREIGN KEY (RosterID)
        REFERENCES roster (RosterID)
);

CREATE TABLE vote (
    VoteID SERIAL PRIMARY KEY,
    CommentID int NOT NULL,
    Approval boolean,
    OwnerIP varchar(20),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP,
    FOREIGN KEY (CommentID)
        REFERENCES comment (CommentID)
);

CREATE TABLE scale (
    ScaleID SERIAL PRIMARY KEY,
    ShortName varchar(30),
    Description varchar(250),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP
);

CREATE TABLE grade (
    GradeID SERIAL PRIMARY KEY,
    ScaleID int NOT NULL,
    RosterID int NOT NULL,
    OwnerIP varchar(20),
    Stars int DEFAULT 0 CHECK (Stars between 0 and 5),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    ModifiedAt TIMESTAMP,
    FOREIGN KEY (RosterID)
        REFERENCES roster (RosterID),
    FOREIGN KEY (ScaleID)
        REFERENCES scale (ScaleID)
);

