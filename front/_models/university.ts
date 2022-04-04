export default class University {
    university_id: number;
    name: string;
    img_file: string;

    constructor(universiti_id: number, name: string, img_file: string = "") {
        this.university_id = universiti_id;
        this.name = name;
        this.img_file = img_file;
    }
}