import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scale } from 'src/app/_models/business';
import { ScaleService } from 'src/app/_services/scale.service';

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

  constructor(
    private fb: FormBuilder,
    private scaleService: ScaleService,
  ) {
    this._scales = []
    this.scaleDescriptionStates = []
  }

  ngOnInit(): void {
    this.rateForm = this.fb.group({
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

  get scales() {
    return this.rateForm.get('scales') as FormArray;
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

  onSubmit(){
  }

}
