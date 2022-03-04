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
    state_id: number;
    img_path: string;

    constructor(campus_id: number, name: string, university_id: number,
        state_id: number, img_path: string) {
        this.campus_id = campus_id;
        this.university_id = university_id;
        this.name = name;
        this.state_id = state_id;
        this.img_path = img_path;
    }
}