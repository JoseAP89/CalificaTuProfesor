export class BusinessException {
  statusCode: number;
  message: string;
  details: string;
}

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

export class University {
    university_id: number;
    name: string;
    img_file: string;

    constructor(universiti_id: number, name: string, img_file: string = "") {
        this.university_id = universiti_id;
        this.name = name;
        this.img_file = img_file;
    }
}

export class Roster {
    roster_id?: number;
    teacher_name: string;
    teacher_lastname1: string;
    teacher_lastname2: string;
    subject_name: string;
    uni_structure_id: number;
    structure_name: string;
    structure_type?: string;
    campus_id: number;
    campus_name?: string;
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

export class Scale {
    scaleId : number;
    description: string;
    name: string;

    constructor(scaleId: number, name: string, description: string) {
        this.scaleId = scaleId;
        this.name = name;
        this.description = description;
    }

}

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

export enum TeacherSearch {
    NAME,
    CAMPUS
}

export class Vessel {
   readonly id: number;
   readonly value: string;

   constructor(id: number, name:string){
       this.id = id;
       this.value = name;
   }

}

export class NewCampus {
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

export class NewUniversity {
    name: string;
    img_file?: string;
    img_type?: string;

    constructor(name: string, img_file?: string, img_type?: string ) {
        this.name = name;
        this.img_file = img_file;
        this.img_type = img_type;
    }
}
