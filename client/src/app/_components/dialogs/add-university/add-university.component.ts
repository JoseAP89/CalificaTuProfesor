import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUniversity, University } from 'src/app/_models/business';
import { UniversityService } from 'src/app/_services/university.service';

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
  ){
  }

  ngOnInit(): void {
    this.universityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(){
    if (this.universityForm.valid) {
      let uni = Object.assign(new University(), this.universityForm.value);
      console.log(uni);
      this.universityService.AddUniversity(uni).subscribe({
        next: res => {
          alert(`La universidad '${res.name}' fue agregada correctamente.`);
        },
        error: e => {
          alert(`Hubo un error agregando la universidad: ${e?.error}`);
        }
      });
    }

  }

}
