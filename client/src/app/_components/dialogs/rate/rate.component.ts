import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentDB, Grade, Roster, RosterDB, Scale, Vote } from 'src/app/_models/business';
import { RatingService } from 'src/app/_services/rating.service';
import { ScaleService } from 'src/app/_services/scale.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  public readonly MAX_LEN_COMMENT = 600;
  public readonly MIN_LEN_COMMENT = 2;
  public rateForm: FormGroup;
  public _scales: Scale[];
  public scaleDescriptionStates: boolean[];
  public averageRate: number = 0;
  public comment: string = ""
  public roster: RosterDB;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RosterDB,
    private fb: FormBuilder,
    private scaleService: ScaleService,
    private ratingService: RatingService,
    private snackbarService: SnackbarService,
  ) {
    this._scales = []
    this.scaleDescriptionStates = []
    this.roster = Object.assign(new RosterDB(), data);
  }

  ngOnInit(): void {
    this.rateForm = this.fb.group({
      subjectName: ['', Validators.required],
      comment: ['', Validators.required],
      scales: this.fb.array([])
    });
    this.scaleService.getScales().subscribe({
      next: res => {
        this._scales = res;
        this.addScalesToForm();
        this.addScalesDescriptionStatus();
      }
    })
  }

  get scales() : FormArray {
    return this.rateForm.get('scales') as FormArray;
  }

  get subjectName(): FormControl {
    return this.rateForm.get('subjectName') as FormControl;
  }

  updateAverageRate(): void {
    let value = (this.scales.value as Array<number>).reduce( (a,b) => a+b, 0) / (this._scales.length * 10.0 * 2.0);
    let res = value.toFixed(1);
    this.averageRate = Number(res);
    let star = document.querySelector(".average-rate");
    star?.setAttribute("data-star",res);
  }

  updateScaleRate(index: number): void {
    let value = this.getScale(index) / (2.0 * 10.0);
    let res = value.toFixed(1);
    let star = document.querySelector(`.scale-rate-${index}`);
    star?.setAttribute("data-star",res);
  }

  updateRates(index: number){
    this.updateAverageRate();
    this.updateScaleRate(index);
  }

  getScale(i: number): number{
    let val =  this.scales.at(i);
    return Number(val.value);
  }

  /** It adds the scales in alphabetic order sent by the server. Both _scales and scales controller have the same argument positions.*/
  addScalesToForm(){
    for (let index = 0; index < this._scales.length; index++) {
      this.scales.push(this.fb.control(0));
    }
  }

  /** It sets up the initial description status of the accordion description for scales. */
  addScalesDescriptionStatus(){
    for (let index = 0; index < this._scales.length; index++) {
      this.scaleDescriptionStates[index] = false;
    }
  }

  onChangeComment(value: string){
    this.comment = value;
  }

  isCommentValid(): boolean {
    let len = this.comment.length;
    return len>= this.MIN_LEN_COMMENT && len<= this.MAX_LEN_COMMENT;
  }

  isDataValid(): boolean{
    return this.rateForm.valid && this.isCommentValid() && this.averageRate>0;
  }

  onSubmit(){
    if (this.isDataValid()) {
      let comment = new CommentDB();
      comment.recordId = null;
      comment.content = this.comment;
      comment.rosterId = this.roster.rosterId!;
      comment.subjectName = this.subjectName.value;
      comment.grades = [];
      for (let i = 0; i < this._scales.length; i++) {
        const esc = this._scales[i];
        // Create Grades
        let grade = new Grade();
        grade.scaleId = esc.scaleId;
        let value = this.getScale(i) / (2.0 * 10.0);
        grade.stars = Number(value.toFixed(1));
        // Create Vote
        let vote = new Vote();
        vote.approval = null;
        comment.vote = vote;
        // Add them to the Comment
        comment.grades.push(grade);
      }
      this.ratingService.addComment(comment).subscribe({
        next: _ => {
          this.snackbarService.showSuccessMessage("Comentario agregado exitosamente.");
        },
        error: error => {
          this.snackbarService.showErrorMessage(error?.message);
        }
      });
    }
  }

}
