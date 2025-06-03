import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize, firstValueFrom } from 'rxjs';
import { NewUniversity, University } from 'src/app/_models/business';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UniversityService } from 'src/app/_services/university.service';

@Component({
  selector: 'app-add-university',
  templateUrl: './add-university.component.html',
  styleUrls: ['./add-university.component.scss']
})
export class AddUniversityComponent implements OnInit {

  public universityForm: FormGroup;
  public isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private universityService: UniversityService,
    private snackbarService: SnackbarService,
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
      this.isProcessing = true;
      let uni = Object.assign(new University(), this.universityForm.value);
      this.universityService.addUniversity(uni)
        .pipe(
          finalize( () => {
            this.isProcessing = false;
          })
        ) 
        .subscribe({
          next: res => {
            this.snackbarService.showSuccessMessage(`La universidad '${res.name}' fue agregada correctamente.`);
            this.dialogRef.close();
          }
        });
    }

  }

}
