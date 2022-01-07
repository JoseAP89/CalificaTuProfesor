package com.backend.restservice.models;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Campus {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer campusID;

    private String name;
    private String universityID;
    private Integer stateID;


    public Integer getCampusID() {
        return campusID;
    }

    public void setCampusID(Integer campusID) {
        this.campusID = campusID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUniversityID() {
        return universityID;
    }

    public void setUniversityID(String universityID) {
        this.universityID = universityID;
    }


    public Integer getStateID() {
        return stateID;
    }

    public void setStateID(Integer stateID) {
        this.stateID = stateID;
    }

    @Override
    public String toString() {
        return "Campus{" +
                "campusID=" + campusID +
                ", name='" + name + '\'' +
                ", universityID='" + universityID + '\'' +
                ", stateID=" + stateID +
                '}';
    }
}
