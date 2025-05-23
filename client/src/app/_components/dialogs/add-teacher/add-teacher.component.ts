import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, debounceTime, firstValueFrom, fromEvent, of, tap } from 'rxjs';
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
  public campusSearchOptions: Observable<Vessel[]>
  public campusError: boolean = false;
  public campusSelected: Campus;

  constructor(
    private fb: FormBuilder,
    private campusService: CampusService,
    private rosterService: RosterService,
    private snackbarService: SnackbarService,
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
      console.log("event::", typedValue);
      this.onSearchCampus(typedValue);
    });
  }

  onSearchCampus(search: string){
    this.campusError = false;
    this.campusSearchOptions = this.campusService.getCampusSearch(search);
  }

  async onSelectCampus() {
    setTimeout( async () => {
      this.campusError = false;
      let campusName = (this.teacherForm.get("campusName")?.value as string)?.trim().replaceAll(" ", "+");
      let campus = await firstValueFrom(
        this.campusService.getShortCampusByName(campusName).pipe(
          tap(() => this.campusError = false),
          catchError(() => {
            this.campusError = true;
            return of(null)
          })
        )
      );
      if (campus == null) {
        this.campusError = true;
      } else {
        this.campusSelected = campus;
        this.campusError = false;
      }

    }, 1_000 * 0.2);
  }

  async onSubmit(){
    if (this.teacherForm.valid && !this.campusError) {
      let teacher: RosterDB = Object.assign(new RosterDB(), this.teacherForm.value);
      teacher.campusId = this.campusSelected.campusId;
      this.rosterService.addRoster(teacher).subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage(`Maestro ${res.teacherName} ${res.teacherLastname1} ${res.teacherLastname2} fue agregado correctamente.`);
        },
        error: error => {
          this.snackbarService.showErrorMessage(`Hubo un error agregando al maestro. ${error}`);
        }
      });
    }
  }

}
