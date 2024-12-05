import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptCancelData, CancelAcceptComponent } from '../_components/dialogs/cancel-accept/cancel-accept.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private durationInSeconds: number = 5;
  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

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

  public openCancelAcceptDialog(data: AcceptCancelData, enterAnimationDuration: string = '100ms', exitAnimationDuration: string= '100ms'): Observable<boolean> {
    let ref = this._dialog.open(CancelAcceptComponent, {
      data,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      width:'600px',
      panelClass: 'dialog-box'
    });
    return ref.afterClosed();
  }
}
