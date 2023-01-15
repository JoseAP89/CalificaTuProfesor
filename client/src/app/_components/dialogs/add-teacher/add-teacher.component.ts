import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UniStructure, Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { UnistructureService } from 'src/app/_services/unistructure.service';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {

  public teacherForm: FormGroup;
  public uniStructures: Observable<Vessel[]>;
  public campusSearchOptions: Observable<Vessel[]>

  constructor(
    private fb: FormBuilder,
    private unistructureService: UnistructureService,
    private campusService: CampusService,
  ) {
  }

  ngOnInit(): void {
    this.uniStructures = this.unistructureService.getUniStructures();
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      lastname1: ['', Validators.required],
      lastname2: ['', Validators.required],
      subject: ['', Validators.required],
      campusId: ['', Validators.required],
      uniStructureId: ['', Validators.required],
      uniStructureName: ['', Validators.required],
    });
  }

  onSearchCampus(search: string){
    this.campusSearchOptions = this.campusService.getCampusSearch(search);
  }

}
