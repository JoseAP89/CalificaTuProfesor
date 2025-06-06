import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, catchError, debounceTime, finalize, firstValueFrom, from, fromEvent, map, of, tap } from 'rxjs';
import { Campus, RosterDB, UniversityArea, Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { RosterService } from 'src/app/_services/roster.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {

  public teacherForm: FormGroup;
  public campusSearchOptions: Observable<Array<Vessel[]>>
  public campusError: boolean = false;
  public campusSelected: Vessel;
  public isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private campusService: CampusService,
    private rosterService: RosterService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<AddTeacherComponent>
  ) {
  }

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      teacherName: ['', Validators.required],
      teacherLastname1: ['', Validators.required],
      teacherLastname2: [''],
      campusName: ['', Validators.required],
    });
    let searchValueInput = document.querySelector("#search-campus-field");
    const keyup$ = fromEvent(searchValueInput, 'keyup');
    keyup$.pipe(
      debounceTime(400)
    ).subscribe( (event: any) => {
      let typedValue = event.target.value;
      this.onSearchCampus(typedValue);
    });
  }

  onSearchCampus(search: string){
    this.campusError = false;
    this.campusSearchOptions = this.campusService.getCampusWithUniversity(search)
      .pipe(
        map( res => {
          return res.map( cu => [
            new Vessel(cu.campusId, cu.name), 
            new Vessel(cu.university.universityId, cu.university.name)
          ]) ;
        })
      );
  }

  onSubmit(){
    if (this.teacherForm.valid && !this.campusError) {
      this.isProcessing = true;
      let teacher: RosterDB = Object.assign(new RosterDB(), this.teacherForm.value);
      teacher.campusId = this.campusSelected.id;
      this.rosterService.addRoster(teacher)
        .pipe(
          finalize( () => {
            this.isProcessing = false;
          })
        ) 
      .subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage(`Maestro ${res.teacherName} ${res.teacherLastname1} ${res.teacherLastname2} fue agregado correctamente.`);
          this.dialogRef.close();
        }
      });
    }
  }

  async onSelectionChange(value: Vessel) {
    this.campusSelected = value;
  }

}
