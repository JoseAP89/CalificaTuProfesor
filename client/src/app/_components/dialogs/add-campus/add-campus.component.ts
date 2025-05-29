import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, debounceTime, firstValueFrom, fromEvent, map, of, tap } from 'rxjs';
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

  @ViewChild('universityInput') universityInput!: ElementRef<HTMLInputElement>;
  public campusForm: FormGroup;
  public states: Observable<Vessel[]>;
  public uniSearchOptions: Observable<Vessel[]>
  public uniError?: boolean = false;
  public uniSelected: Vessel;


  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private universityService: UniversityService,
    private campusService: CampusService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    let searchValueInput = document.querySelector("#university-search-input");
    const keyup$ = fromEvent(searchValueInput, 'keyup');
    keyup$.pipe(
      debounceTime(400)
    ).subscribe( (event: any) => {
      this.onSearchUni(event?.target?.value);
    });
    this.states = this.stateService.getStates();
    this.campusForm = this.fb.group({
      name: ['', Validators.required],
      universityName: ['', Validators.required],
      stateId: ['', Validators.required],
    });
  }

  onSearchUni(search: string){
    search = search?.trim();
    if(!search) return;
    this.uniError = false;
    this.uniSearchOptions = this.universityService.searchUniversity(search).pipe(
      tap( res => {
        if(res && res.length === 0){
          this.uniError = true;
        }
      }),
      catchError(() => {
        this.uniError = true;
        return of(null);
      })
    );
  }

  async onSelectionChange(value: Vessel) {
    this.uniSelected = value;
  }

  async onSubmit(){
    if (this.campusForm.valid && !this.uniError) {
      let campus: NewCampus = Object.assign(new NewCampus(), this.campusForm.value);
      campus.universityId = this.uniSelected.id;
      this.campusService.addCampus(campus).subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage(`Campus '${res.name}' fue agregado correctamente.`);
        },
        error: error => {
          this.snackbarService.showErrorMessage(`Hubo un error agregando al campus. ${error}`);
        }
      });
    }
  }

}
