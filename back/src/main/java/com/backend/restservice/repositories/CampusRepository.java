package com.backend.restservice.repositories;
import com.backend.restservice.models.Campus;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete
public interface CampusRepository extends CrudRepository<Campus, Integer>{

}
