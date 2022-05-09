import University from "./university";

export class CampusUniversity {
    campus_id: number;
    name: string;
    university: University

    constructor(campus_id: number, name: string, university: University) {
        this.campus_id = campus_id;
        this.university = university;
        this.name = name;
    }
}


export class Campus{
    campus_id: number;
    name: string;
    university_id: number;
    university_name: string;
    state_id: number;
    state_name: string;
    img_file: string;
    full_file_name: string;

    constructor(campus_id: number, name: string, university_id: number,
        state_id: number, img_file: string, full_file_name: string, university_name: string, state_name: string) {
        this.campus_id = campus_id;
        this.university_id = university_id;
        this.name = name;
        this.state_id = state_id;
        this.img_file = img_file;
        this.full_file_name = full_file_name;
        this.university_name = university_name;
        this.state_name = state_name;
    }
}