export default class University {
    university_id: number;
    name: string;
    img_path: string;

    constructor(universiti_id: number, name: string, img_path: string = "") {
        this.university_id = universiti_id;
        this.name = name;
        this.img_path = img_path;
    }
}