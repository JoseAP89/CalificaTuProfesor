import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { Campus, NewCampus, NewUniversity, Vessel } from 'src/app/_models/business';
import { CampusService } from 'src/app/_services/campus.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { StateService } from 'src/app/_services/state.service';
import { UniversityService } from 'src/app/_services/university.service';

@Component({
  selector: 'app-add-campus',
  templateUrl: './add-campus.component.html',
  styleUrls: ['./add-campus.component.scss']
})
export class AddCampusComponent implements OnInit {

  public campusForm: FormGroup;
  public states: Observable<Vessel[]>;
  public uniSearchOptions: Observable<Vessel[]>
  public uniError: boolean = false;
  public uniSelected: Vessel;


  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private universityService: UniversityService,
    private campusService: CampusService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.states = this.stateService.getStates();
    this.campusForm = this.fb.group({
      name: ['', Validators.required],
      universityName: ['', Validators.required],
      stateId: ['', Validators.required],
    });
  }

  onSearchUni(search: string){
    this.uniError = false;
    this.uniSearchOptions = this.universityService.searchUniversity(search);;
  }

  async onSelectUni() {
    setTimeout( async () => {
      this.uniError = false;
      let uniName = (this.campusForm.get("universityName")?.value as string)?.trim();
      let uniNameUrl = uniName.replaceAll(" ", "+");
      let uni = await firstValueFrom(
        this.universityService.searchUniversity(uniNameUrl).pipe(
          tap(() => this.uniError = false),
          map( data => {
            let res = data.filter( u => u.value.toLowerCase() == uniName.toLowerCase().trim());
            return res !=null ? res[0] : null;
          }),
          catchError(() => {
            this.uniError = true;
            return of(null)
          })
        )
      );
      if (uni == null) {
        this.uniError = true;
      } else {
        this.uniSelected = uni;
        this.uniError = false;
      }

    }, 1_000 * 0.2);
  }

  async onSubmit(){
    if (this.campusForm.valid && !this.uniError) {
      let campus: NewCampus = Object.assign(new NewCampus(), this.campusForm.value);
      campus.universityId = this.uniSelected.id;
      this.campusService.addCampus(campus).subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage(`Campus con nombre '${res.name}' fue agregado correctamente.`);
        },
        error: error => {
          this.snackbarService.showErrorMessage(`Hubo un error agregando al campus. ${error}`);
        }
      });
    }
  }

}
