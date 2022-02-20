import University from "./university";

export default class Campus {
    campus_id: number;
    name: string;
    university: University

    constructor(campus_id: number, name: string, university: University) {
        this.campus_id = campus_id;
        this.university = university;
        this.name = name;
    }
}