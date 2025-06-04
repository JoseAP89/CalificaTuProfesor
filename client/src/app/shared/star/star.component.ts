import { AfterViewInit, Component, ElementRef, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements AfterViewInit, OnChanges {
  @Input() averageGrade: number = 0;
  @Input() fontSize: number = 24;
  @Input() showAverageValue: boolean = false;
  @Input() averageValueColor: string = "grey";

  fullStars: number = 0;
  hasPartialStar: boolean = false;
  partialStarWidth: number = 0;
  emptyStars: number = 0;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.calculateStars();
  }

  ngOnChanges(): void {
    this.calculateStars();
  }

  private calculateStars(): void {
    // Ensure average is between 0 and 5
    const clampedAverage = Math.min(5, Math.max(0, this.averageGrade));

    this.fullStars = Math.floor(clampedAverage);
    const remainder = clampedAverage - this.fullStars;

    this.hasPartialStar = remainder > 0;
    this.partialStarWidth = remainder * 100;
    this.emptyStars = 5 - this.fullStars - (this.hasPartialStar ? 1 : 0);

    // Update CSS custom property
    const container = this.el.nativeElement.querySelector('.star-rating-container');
    const numericValueEl = this.el.nativeElement.querySelector('.numeric-star-value');
    if (container) {
      container.style.setProperty('--star-size', `${this.fontSize}px`);
    }
    if (numericValueEl) {
      numericValueEl.style.setProperty('font-size', `${this.fontSize * .5}px`);
      numericValueEl.style.setProperty('color', `${this.averageValueColor}`);
    }
  }

}
