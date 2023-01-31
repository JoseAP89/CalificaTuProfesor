import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private durationInSeconds: number = 10;
  constructor(private _snackBar: MatSnackBar) { }

  public showSuccessMessage(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: this.durationInSeconds * 1_000,
      panelClass: "success-snackbar"
    });
  }

  public showErrorMessage(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: this.durationInSeconds * 1_000,
      panelClass: "error-snackbar"
    });
  }

}
