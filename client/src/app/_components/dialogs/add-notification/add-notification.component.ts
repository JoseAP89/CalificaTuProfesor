import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentDTO, NotificationDTO, NotificationTypeDTO } from 'src/app/_models/business';
import { NotificationService } from 'src/app/_services/notification.service';
import { RatingService } from 'src/app/_services/rating.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

export interface NotificationDialogData {
  commentId: number,
  userRecordId: string
}

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {
  public readonly MIN_LEN_COMMENT = 3;
  public readonly MAX_LEN_COMMENT = 300;
  public isProcessing = false;
  public isChecked: boolean = false;
  public content: string = "";
  public notificationTypes: NotificationTypeDTO[];
  public selectedNotificationTypeId: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationDialogData,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddNotificationComponent>,
    private snackbarService: SnackbarService,
  ) { 
    this.notificationTypes = [];
  }

  isValid(): boolean {
    return this.content && this.selectedNotificationTypeId!==0 && this.isChecked;
  }

  ngOnInit(): void {
    this.notificationService.getNotificationTypes().subscribe({
      next: res => {
        this.notificationTypes = res;
      }
    })
  }

  getNotificationType(id: number): NotificationTypeDTO{
    if (this.notificationTypes) {
      for (const element of this.notificationTypes) {
        if(element.notificationTypeId === id){
          return element;
        }
      }
    }
    return null;
  }

  onOk(){
    if (this.isValid()) {
      const body : NotificationDTO = {
        notificationId: 0,
        message : this.content,
        notificationTypeId: this.selectedNotificationTypeId,
        commentId: this.data.commentId,
        userId: this.data.userRecordId
      }
      this.notificationService.postNotification(body).subscribe({
        next: res => {
          this.snackbarService.showSuccessMessage("Notificación creada exitosamente. Los administradores revisaran el contenido, y de ser necesario, remover el comentario agraviante.")
          this.dialogRef.close(res);
        }
      })
      
    }

  }

}
