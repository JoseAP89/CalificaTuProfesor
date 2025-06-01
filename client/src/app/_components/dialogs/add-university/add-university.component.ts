import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { NewUniversity, University } from 'src/app/_models/business';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UniversityService } from 'src/app/_services/university.service';
import { ApiResponseAxum, FilterRequest, WasmFilterService } from 'src/app/_services/wasmFilter.service';

@Component({
  selector: 'app-add-university',
  templateUrl: './add-university.component.html',
  styleUrls: ['./add-university.component.scss']
})
export class AddUniversityComponent implements OnInit {

  public universityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private universityService: UniversityService,
    private snackbarService: SnackbarService,
    private wasmFilterService: WasmFilterService,
    private dialogRef: MatDialogRef<AddUniversityComponent>
  ){
  }

  ngOnInit(): void {
    this.universityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async onSubmit(){
    if (this.universityForm.valid) {
      let uni = Object.assign(new University(), this.universityForm.value);
      console.log(uni);
      // analyze if the name and lastname are not inappropiate first before saving to DB
      let filter: FilterRequest = {
        words: [uni.name].filter(d => d && d.length>0)
      }
      let nexus_response: ApiResponseAxum = {
        message: "",
        is_inappropiate: true
      };
      await firstValueFrom(this.wasmFilterService.analyze_words(filter)).then( res => {
        if (res.is_inappropiate != null) {
          nexus_response = res;
        }
      });
      if (nexus_response.is_inappropiate) {
        this.snackbarService.showErrorMessage(nexus_response.message, 20_000);
      } else {
        this.universityService.addUniversity(uni).subscribe({
          next: res => {
            this.snackbarService.showSuccessMessage(`La universidad '${res.name}' fue agregada correctamente.`);
            this.dialogRef.close();
          },
          error: e => {
            this.snackbarService.showErrorMessage(`Hubo un error agregando la universidad: ${e?.error}`);
          }
        });
      }
    }

  }

}
