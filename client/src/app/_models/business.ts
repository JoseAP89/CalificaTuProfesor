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
  uniStructureId: number;
  structureName: string;
  campusId: number;
  campusName?: string;
  recordId: string;

  get fullName(): string {
    return `${this.teacherName} ${this.teacherLastname1} ${this.teacherLastname2}`.trim();
  }
}

export class Roster {
  rosterId: number;
  campusId: number;
  teacherName: string;
  teacherLastname1: string;
  teacherLastname2: string;
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
  rosterRecordId: string; // recordId from the Roster object
  campus: Campus;
  teacherName: string;
  teacherLastname1: string;
  teacherLastname2: string;
  uniStructureName: string;
  structureName: string;
}

export enum TeacherSearch {
    NAME,
    CAMPUS
}

export class Vessel {
   readonly id: number;
   readonly signature: string;
   readonly value: string;

   constructor(id: number, value:string, signature: string = ""){
       this.id = id;
       this.value = value;
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

export class Grade {
  gradeId: number;
  scaleId: number;
  commentId: number;
  stars: number;
}

export class Vote {
  voteId: number;
  commentId: number;
  userId: string;
  approval: boolean|null;
}

export class CommentDTO {
  commentId: number;
  recordId: string;
  subjectName: string;
  rosterId: number;
  content: string;
  userId: string;
  grades: Array<Grade>;
  votes: Array<Vote>;
  likes: number;
  dislikes: number;
  currentUserVote?:	boolean;
  createdAt: string;
  modifiedAt: string;
}

export class VoteDTO {
  voteId: number;
  commentId: number;
  userId: string;
  approval: boolean|null;
}

export class RosterRating {
  rosterId: number;
  averageGrade: number;
  grades: Array<Grade>;
}

export enum SortPaginator {
  DateAsc,
  DateDesc,
  MostLiked,
  MostDisliked,
  SubjectAsc,
  SubjectDesc
}

export class TableData<T> {
  data: T[];
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

export class CommentContentDTO {
  commentId: number;
  content: string;
}