import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campus, CampusTeacherList, RankingTopTeacherList } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {

  private recordId: string;
  public campusInfo: Campus;
  public teacherList: Array<CampusTeacherList> = [];
  public rankTeacherList: Array<RankingTopTeacherList> = [];

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
  ) {
    this.teacherList = [
      {
        name: "Dr. Emily",
        firstLastName: "Johnson",
        secondLastName: "Smith",
        totalComments: 12,
        averageGrade: 4.85
      },
      {
        name: "Prof. Michael",
        firstLastName: "Williams",
        secondLastName: "Brown",
        totalComments: 8,
        averageGrade: 4.72
      },
      {
        name: "Dr. Sarah",
        firstLastName: "Davis",
        secondLastName: "Miller",
        totalComments: 15,
        averageGrade: 4.91
      },
      {
        name: "Prof. Robert",
        firstLastName: "Wilson",
        secondLastName: "Taylor",
        totalComments: 5,
        averageGrade: 3.95
      },
      {
        name: "Dr. Jennifer",
        firstLastName: "Anderson",
        secondLastName: "Thomas",
        totalComments: 9,
        averageGrade: 4.63
      },
      {
        name: "Prof. David",
        firstLastName: "Martinez",
        secondLastName: "Garcia",
        totalComments: 7,
        averageGrade: 3.78
      },
      {
        name: "Dr. Jessica",
        firstLastName: "Robinson",
        secondLastName: "Clark",
        totalComments: 11,
        averageGrade: 4.55
      },
      {
        name: "Prof. Daniel",
        firstLastName: "Rodriguez",
        secondLastName: "Lewis",
        totalComments: 4,
        averageGrade: 2.95
      },
      {
        name: "Dr. Amanda",
        firstLastName: "Lee",
        secondLastName: "Walker",
        totalComments: 14,
        averageGrade: 4.82
      },
      {
        name: "Prof. Christopher",
        firstLastName: "Hall",
        secondLastName: "Allen",
        totalComments: 6,
        averageGrade: 3.64
      },
      {
        name: "Dr. Elizabeth",
        firstLastName: "Young",
        secondLastName: "King",
        totalComments: 10,
        averageGrade: 4.47
      },
      {
        name: "Prof. Matthew",
        firstLastName: "Wright",
        secondLastName: "Scott",
        totalComments: 3,
        averageGrade: 2.83
      },
      {
        name: "Dr. Lauren",
        firstLastName: "Lopez",
        secondLastName: "Green",
        totalComments: 13,
        averageGrade: 4.76
      },
      {
        name: "Prof. Andrew",
        firstLastName: "Hill",
        secondLastName: "Adams",
        totalComments: 5,
        averageGrade: 3.52
      },
      {
        name: "Dr. Rachel",
        firstLastName: "Baker",
        secondLastName: "Gonzalez",
        totalComments: 8,
        averageGrade: 4.38
      },
      {
        name: "Prof. Kevin",
        firstLastName: "Nelson",
        secondLastName: "Carter",
        totalComments: 2,
        averageGrade: 1.95
      },
      {
        name: "Dr. Nicole",
        firstLastName: "Mitchell",
        secondLastName: "Perez",
        totalComments: 11,
        averageGrade: 4.67
      },
      {
        name: "Prof. Jason",
        firstLastName: "Roberts",
        secondLastName: "Turner",
        totalComments: 7,
        averageGrade: 3.89
      },
      {
        name: "Dr. Samantha",
        firstLastName: "Phillips",
        secondLastName: "Campbell",
        totalComments: 9,
        averageGrade: 4.59
      },
      {
        name: "Prof. Ryan",
        firstLastName: "Evans",
        secondLastName: "Parker",
        totalComments: 4,
        averageGrade: 2.76
      }
    ];
    this.rankTeacherList = [
      {
        rank: 1,
        name: "Maria",
        firstLastName: "Garcia",
        secondLastName: "Lopez",
        totalComments: 128,
        averageGrade: 4.95,
        campusId: 101,
        campusName: "Central Campus"
      },
      {
        rank: 2,
        name: "John",
        firstLastName: "Smith",
        secondLastName: "Williams",
        totalComments: 95,
        averageGrade: 4.89,
        campusId: 102,
        campusName: "North Campus"
      },
      {
        rank: 3,
        name: "Wei",
        firstLastName: "Zhang",
        secondLastName: "",
        totalComments: 112,
        averageGrade: 4.85,
        campusId: 103,
        campusName: "East Campus"
      },
      {
        rank: 4,
        name: "Aisha",
        firstLastName: "Johnson",
        secondLastName: "Brown",
        totalComments: 87,
        averageGrade: 4.82,
        campusId: 104,
        campusName: "West Campus"
      },
      {
        rank: 5,
        name: "Carlos",
        firstLastName: "Rodriguez",
        secondLastName: "Martinez",
        totalComments: 76,
        averageGrade: 4.78,
        campusId: 101,
        campusName: "Central Campus"
      },
      {
        rank: 6,
        name: "Sophie",
        firstLastName: "Dubois",
        secondLastName: "",
        totalComments: 68,
        averageGrade: 4.75,
        campusId: 105,
        campusName: "International Campus"
      },
      {
        rank: 7,
        name: "James",
        firstLastName: "Wilson",
        secondLastName: "Taylor",
        totalComments: 82,
        averageGrade: 4.72,
        campusId: 102,
        campusName: "North Campus"
      },
      {
        rank: 8,
        name: "Yuki",
        firstLastName: "Tanaka",
        secondLastName: "",
        totalComments: 59,
        averageGrade: 4.68,
        campusId: 103,
        campusName: "East Campus"
      },
      {
        rank: 9,
        name: "Olivia",
        firstLastName: "Brown",
        secondLastName: "Davis",
        totalComments: 64,
        averageGrade: 4.65,
        campusId: 104,
        campusName: "West Campus"
      },
      {
        rank: 10,
        name: "Mohammed",
        firstLastName: "Ali",
        secondLastName: "Khan",
        totalComments: 71,
        averageGrade: 4.62,
        campusId: 105,
        campusName: "International Campus"
      }
    ];
  }

  ngOnInit(): void {
    this.recordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.campusService.getCampusByRecordId(this.recordId).subscribe({
      next: res => {
        this.campusInfo = res;
      }
    });

  }

  getFullName(name: string, lastname1: string, lastname2: string): string {
    if(!name || !lastname1) return "";
    return (`${name} ${lastname1} ${lastname2}`).trim();
  }

}
