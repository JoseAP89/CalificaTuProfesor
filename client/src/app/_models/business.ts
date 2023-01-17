export class BusinessException {
  statusCode: number;
  message: string;
  details: string;
}

export class CampusUniversity {
    campus_id: number;
    name: string;
    university: University
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
}

export class University {
    university_id: number;
    name: string;
    img_file: string;
}

export class RosterDB {
    roster_id?: number;
    teacher_name: string;
    teacher_lastname1: string;
    teacher_lastname2: string;
    subject_name: string;
    uni_structure_id: number;
    structure_name: string;
    campus_id: number;
    campus_name?: string;
}

export class Roster {
  rosterId: number;
  campusId: number;
  teacherName: string;
  teacherLastname1: string;
  teacherLastname2: string;
  subjectName: string;
  uniStructureId: number;
  structureName: string;

}

export class Scale {
    scaleId : number;
    description: string;
    name: string;
}

export class TeacherWithCampus {
    roster_id : number;
    campus: Campus;
    teacher_name : string;
    teacher_lastname1 : string;
    teacher_lastname2 : string;
    subject_name : string;
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
}

export class NewUniversity {
    name: string;
    img_file?: string;
    img_type?: string;
}

export class UniStructure {
  uniStructureId: number;
  name: string;
  code: string;
}
