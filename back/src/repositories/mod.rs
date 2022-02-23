pub mod search_name;
pub mod campus_repo;
pub mod roster_repo;
pub mod university_repo;
pub use self::search_name::search_name_repo;
pub use self::campus_repo::CampusRepo;
pub use self::roster_repo::RosterRepo;
pub use self::university_repo::UniversityRepo;