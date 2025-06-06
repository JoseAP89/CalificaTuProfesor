import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTeacherComponent } from '../dialogs/add-teacher/add-teacher.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddUniversityComponent } from '../dialogs/add-university/add-university.component';
import { AddCampusComponent } from '../dialogs/add-campus/add-campus.component';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  public itemDialogWidth: number = 378; // px
  public itemDialogHeight: number = 200; // px
  public refOpenNewTeacherDialog: any;
  public refOpenNewCampusDialog: any;
  public refOpenNewUniversityDialog: any;
  private screenWidth: number = window?.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!event) {
      return;
    }
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
  }

  openAddTeacherDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.refOpenNewTeacherDialog = this.dialog.open(AddTeacherComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "90vw",
      maxWidth: "650px",
      height: "321px",
      panelClass: 'dialog-box'
    });
    this.refOpenNewTeacherDialog.afterClosed().subscribe(() =>{
      this.refOpenNewTeacherDialog = null;
    });
  }

  openAddCampusDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.refOpenNewCampusDialog = this.dialog.open(AddCampusComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "90vw",
      maxWidth: "650px",
      height: "395px",
      panelClass: 'dialog-box'
    });
    this.refOpenNewCampusDialog.afterClosed().subscribe(() =>{
      this.refOpenNewCampusDialog = null;
    });
    
  }

  openAddUniversityDialog(enterAnimationDuration: string = '500ms', exitAnimationDuration: string= '500ms'): void {
    this.refOpenNewUniversityDialog = this.dialog.open(AddUniversityComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width: "90vw",
      maxWidth: "650px",
      height: "225px",
      panelClass: 'dialog-box'
    });
    this.refOpenNewUniversityDialog.afterClosed().subscribe(() =>{
      this.refOpenNewUniversityDialog = null;
    });
  }


}
