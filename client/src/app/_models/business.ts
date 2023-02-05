export class BusinessException {
  statusCode: number;
  message: string;
  details: string;
}

export class CampusUniversity {
    campusId: number;
    name: string;
    university: University
}


export class Campus{
    campusId: number;
    name: string;
    universityId: number;
    universityName: string;
    stateId: number;
    stateName: string;
    imgFile: string;
    fullFileName: string;
}

export class University {
  universityId: number;
  name: string;
  imgFile: string;
}

export class RosterDB {
  rosterId?: number;
  teacherName: string;
  teacherLastname1: string;
  teacherLastname2: string;
  subjectName: string;
  uniStructureId: number;
  structureName: string;
  campusId: number;
  campusName?: string;
  recordId: string;
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
    code: string;
}

export class TeacherCampus {
  rosterId: number;
  signature: string;
  campus: Campus;
  teacherName: string;
  teacherLastname1: string;
  teacherLastname2: string;
  subjectName: string;

}

export enum TeacherSearch {
    NAME,
    CAMPUS
}

export class Vessel {
   readonly id: number;
   readonly signature: string;
   readonly value: string;

   constructor(id: number, name:string, signature: string = ""){
       this.id = id;
       this.value = name;
       this.signature = signature;
   }

}

export class NewCampus {
    name: string;
    imgType?: string;
    stateId: number;
    universityId: number;
    imgFile?: string;
}

export class NewUniversity {
    name: string;
    imgFile?: string;
    imgType?: string;
}

export class UniStructure {
  uniStructureId: number;
  name: string;
  code: string;
}
