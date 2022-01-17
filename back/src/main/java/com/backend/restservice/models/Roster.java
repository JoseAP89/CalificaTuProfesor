package com.backend.restservice.models;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Roster {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer rosterID;
    private Integer campusID;
    private String teacherName;
    private String teacherLastName1;
    private String teacherLastName2;
    private String subjectName;

    public Integer getRosterID() {
        return rosterID;
    }

    public Integer getCampusID() {
        return campusID;
    }

    public void setCampusID(Integer campusID) {
        this.campusID = campusID;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getTeacherLastName2() {
        return teacherLastName2;
    }

    public void setTeacherLastName2(String teacherLastName2) {
        this.teacherLastName2 = teacherLastName2;
    }

    public String getTeacherLastName1() {
        return teacherLastName1;
    }

    public void setTeacherLastName1(String teacherLastName1) {
        this.teacherLastName1 = teacherLastName1;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }


}
