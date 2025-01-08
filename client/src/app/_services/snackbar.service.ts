import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptCancelData, CancelAcceptComponent } from '../_components/dialogs/cancel-accept/cancel-accept.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  public showSuccessMessage(message: string, waitingTimeMs = 5_000.0) {
    this._snackBar.open(message, "Cerrar", {
      duration:  waitingTimeMs,
      panelClass: "success-snackbar"
    });
  }

  public showErrorMessage(message: string, waitingTimeMs = 5_000.0) {
    this._snackBar.open(message, "Cerrar", {
      duration:  waitingTimeMs,
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
