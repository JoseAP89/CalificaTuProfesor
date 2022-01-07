package com.backend.restservice.models;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class State {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer stateID;

    private String name;


    public Integer getStateID() {
        return stateID;
    }

    public void setStateID(Integer stateID) {
        this.stateID = stateID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "State{" +
                "stateID=" + stateID +
                ", name='" + name + '\'' +
                '}';
    }
}
