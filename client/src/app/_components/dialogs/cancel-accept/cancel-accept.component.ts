import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface AcceptCancelData {
  message?: string,
  title?: string,
  okBtnName?: string;
  cancelBtnName?: string;
}

@Component({
  selector: 'app-cancel-accept',
  templateUrl: './cancel-accept.component.html',
  styleUrls: ['./cancel-accept.component.scss']
})
export class CancelAcceptComponent {

  okBtnName: string = "Ok";
  cancelBtnName: string = "Cancel";
  title: string = "Dialog box";
  message: string = "¿Estas seguro que quieres llevar a cabo esa acción?";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CancelAcceptComponent,
    public dialogRef: MatDialogRef<CancelAcceptComponent>
  ) {
    this.title = data.title || this.title;
    this.message = data.message || this.message;
    this.okBtnName = data.okBtnName || this.okBtnName;
    this.cancelBtnName = data.cancelBtnName || this.cancelBtnName;
  }

  onOk() {
    this.dialogRef.close(true);
  }
}
