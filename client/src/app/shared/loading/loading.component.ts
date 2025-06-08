import { Component } from '@angular/core';
import { of } from 'rxjs';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  isLoading$ = this.loadingService?.isLoading$ ?? of(false);

  constructor(private loadingService: LoadingService) { }
}
