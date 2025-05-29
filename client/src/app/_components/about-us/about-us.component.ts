import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Scale } from 'src/app/_models/business';
import { ScaleService } from 'src/app/_services/scale.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  scales: Observable<Scale[]>;
  constructor(private scaleService: ScaleService) {
    
  }

  ngOnInit(): void {
    this.scales = this.scaleService.getScales();
  }

}
