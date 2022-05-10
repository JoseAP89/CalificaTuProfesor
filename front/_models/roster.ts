export default class Roster {
    roster_id?: number;
    teacher_name: string;
    teacher_lastname1: string;
    teacher_lastname2: string;
    subject_name: string;
    uni_structure_id: number;
    structure_name: string;
    structure_type: string;
    campus_id: number;
    campus_name: string;
    /**
     *
     */
    constructor(roster_id: number = 0, teacher_name: string, teacher_lastname1: string, teacher_lastname2: string,
        subject_name: string, uni_structure_id: number, structure_name: string, structure_type: string, campus_id: number,
        campus_name: string) {
        this.roster_id = roster_id;
        this.teacher_name = teacher_name;
        this.teacher_lastname1 = teacher_lastname1;
        this.teacher_lastname2 = teacher_lastname2;
        this.subject_name = subject_name;
        this.uni_structure_id = uni_structure_id;
        this.structure_name = structure_name;
        this.structure_type = structure_type;
        this.campus_id = campus_id;
        this.campus_name = campus_name;
    }
}