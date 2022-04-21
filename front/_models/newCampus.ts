export default class NewCampus {
    name: string;
    img_type?: string;
    state_id: number;
    university_id: number;
    img_file?: string;

    constructor(name: string, state_id: number, university_id: number, img_file?: string, img_type?: string) {
        this.name = name;
        this.university_id = university_id;
        this.img_type = img_type;
        this.state_id = state_id;
        this.img_file = img_file;
    }
}