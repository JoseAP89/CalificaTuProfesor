import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CommentDTO, Grade, Roster, RosterDB, Scale, StudyField, UniversityArea, Vote } from 'src/app/_models/business';
import { RatingService } from 'src/app/_services/rating.service';
import { ScaleService } from 'src/app/_services/scale.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { MAX_LEN_COMMENT, MIN_LEN_COMMENT } from '../../constants';
import { getHttpErrorMessage } from 'src/app/_helpers/miscelaneous';
import { UniversityAreaService } from 'src/app/_services/universityArea.service';
import { UseridService } from 'src/app/_services/userid.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit, OnDestroy {

  public readonly MAX_LEN_COMMENT = MAX_LEN_COMMENT;
  public readonly MIN_LEN_COMMENT = MIN_LEN_COMMENT;
  public rateForm: FormGroup;
  public _scales: Scale[];
  public scaleDescriptionStates: boolean[];
  public averageRate: number = 0;
  public comment: string = ""
  public roster: RosterDB;
  public currentUserId: string;
  public universityAreas: UniversityArea[] = [];
  public isProcessing: boolean = false;
  public averageGradeStarSize: number = 25;
  private destroy$ = new Subject<void>();
  
  screenWidth: number = window?.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!event) {
      return;
    }
    this.updateAverageStarSize();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RosterDB,
    public dialogRef: MatDialogRef<RateComponent, CommentDTO>,
    private fb: FormBuilder,
    private scaleService: ScaleService,
    private ratingService: RatingService,
    private universityAreaService: UniversityAreaService,
    private snackbarService: SnackbarService,
    private useridService: UseridService,
  ) {
    this._scales = []
    this.scaleDescriptionStates = []
    this.roster = Object.assign(new RosterDB(), data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.useridService.currentUserId
      .pipe(takeUntil(this.destroy$))
      .subscribe({next: res => this.currentUserId = res})
    this.rateForm = this.fb.group({
      subjectName: ['', Validators.required],
      comment: ['', Validators.required],
      universityAreaId: [0, Validators.required],
      studyFieldId: [0, Validators.required],
      scales: this.fb.array([])
    });
    this.scaleService.getScales().subscribe({
      next: res => {
        this._scales = res;
        this.addScalesToForm();
        this.addScalesDescriptionStatus();
      }
    });
    this.universityAreaService.getAllUniversityAreas().subscribe({
      next: res => {
        this.universityAreas = res;  
        this.updateAverageStarSize();
      }
    })
  }

  get scales() : FormArray {
    return this.rateForm.get('scales') as FormArray;
  }
  get universityAreaId() : FormControl {
    return this.rateForm.get('universityAreaId') as FormControl;
  }
  get studyFieldId() : FormControl {
    return this.rateForm.get('studyFieldId') as FormControl;
  }
  get subjectName(): FormControl {
    return this.rateForm.get('subjectName') as FormControl;
  }

  onChangeUniversityArea(){
    this.rateForm.patchValue({
      studyFieldId: 0
    });
  }

  getStudyFieldByUniAreaId(uniAreaId: number) : StudyField[]{
    if (uniAreaId>0) {
      for (const area of this.universityAreas) {
        if(area.universityAreaId == uniAreaId) return area.studyFields;
      }
    }
    return [];
  }

  updateAverageRate(): void {
    const difficultIndex = this._scales?.map(s => s.code)?.indexOf('DI');
    const scaleValues = this.scales.value?.filter((_: number, i:number) => i !== difficultIndex);
    let value = (scaleValues as Array<number>).reduce( (a,b) => a+b, 0) / (scaleValues.length * 10.0 * 2.0);
    let res = value.toFixed(2);
    this.averageRate = Number(res);
  }

  updateScaleRate(index: number): number {
    const value = this.getScale(index) / (2.0 * 10.0);
    return Number(value.toFixed(2));
  }

  updateRates(index: number){
    this.updateAverageRate();
    this.updateScaleRate(index);
  }

  getScale(i: number): number{
    let val =  this.scales.at(i);
    return Number(val.value);
  }

  /** It adds the scales in the order sent by the server. Both _scales and scales controller have the same argument positions.*/
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
    return this.rateForm.valid && this.isCommentValid() && this.averageRate > 0 && this.studyFieldId.value > 0;
  }

  async onSubmit(){
    if (this.isDataValid()) {
      this.isProcessing = true;
      let comment = new CommentDTO();
      comment.recordId = null;
      comment.content = this.comment;
      comment.rosterId = this.roster.rosterId!;
      comment.subjectName = this.subjectName.value;
      comment.studyFieldId = this.studyFieldId.value;
      comment.userId = await firstValueFrom(this.useridService.checkCurrentUserIdFromLocalStorage());
      comment.grades = [];
      for (let i = 0; i < this._scales.length; i++) {
        const esc = this._scales[i];
        // Create Grades
        let grade = new Grade();
        grade.scaleId = esc.scaleId;
        let value = this.getScale(i) / (2.0 * 10.0);
        grade.stars = Number(value.toFixed(2));
        // Create Vote
        let vote = new Vote();
        vote.approval = null;
        comment.votes = [vote];
        // Add them to the Comment
        comment.grades.push(grade);
      }
      this.ratingService.addComment(comment)
        .pipe(
          finalize( () => {
            this.isProcessing = false;
          })
        ) 
      .subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage("Comentario agregado exitosamente.");
          this.dialogRef.close(res);
        }
      });
    }
  }

  updateAverageStarSize(){
    this.screenWidth = window?.innerWidth;
    if(this.screenWidth <= 520) {
      this.averageGradeStarSize = 20;
    } else {
      this.averageGradeStarSize = 25;
    }
  }

}
