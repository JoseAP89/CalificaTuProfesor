import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campus } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {

  private recordId: string;
  public campusInfo: Campus;

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
  ) {
  }

  ngOnInit(): void {
    this.recordId = this.route.snapshot.paramMap.get('recordId') ?? "";
    this.campusService.getCampusByRecordId(this.recordId).subscribe({
      next: res => {
        this.campusInfo = res;
      }
    });
  }
}
