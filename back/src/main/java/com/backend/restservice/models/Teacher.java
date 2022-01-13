package com.backend.restservice.models;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Teacher {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer teacherID;
    private String name;
    private String firstLastName;
    private String secondLastName;

    public Integer getTeacherID() {
        return teacherID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstLastName() {
        return firstLastName;
    }

    public void setFirstLastName(String firstLastName) {
        this.firstLastName = firstLastName;
    }

    public String getSecondLastName() {
        return secondLastName;
    }

    public void setSecondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
    }

    public String getFullName() {
        return name + " " + firstLastName + " " + (secondLastName != null? secondLastName: "");
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "Teacher{" +
                "teacherID=" + teacherID +
                ", name='" + name + '\'' +
                ", firstLastName='" + firstLastName + '\'' +
                ", secondLastName='" + secondLastName + '\'' +
                '}';
    }

}
