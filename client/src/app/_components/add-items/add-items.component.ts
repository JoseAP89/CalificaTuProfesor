import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTeacherComponent } from '../dialogs/add-teacher/add-teacher.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUniversityComponent } from '../dialogs/add-university/add-university.component';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
  }

  openAddTeacherDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.dialog.open(AddTeacherComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: 'dialog-box'
    });
  }

  openAddUniversityDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.dialog.open(AddUniversityComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: 'dialog-box'
    });
  }

}
