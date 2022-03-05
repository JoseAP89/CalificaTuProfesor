import { Campus } from "./campus";

export class TeacherWithCampus {
    roster_id : number;
    campus: Campus;
    teacher_name : string;
    teacher_lastname1 : string;
    teacher_lastname2 : string;
    subject_name : string;

    /**
     *
     */
    constructor(roster_id: number, campus: Campus, teacher_name: string,
        teacher_lastname1: string, teacher_lastname2: string, subject_name: string) {
        this.roster_id =  roster_id ;
        this.campus = campus;
        this.teacher_name =  teacher_name ;
        this.teacher_lastname1 =  teacher_lastname1 ;
        this.teacher_lastname2 =  teacher_lastname2 ;
        this.subject_name =  subject_name ;
        
    }
    
}