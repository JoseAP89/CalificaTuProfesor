import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentContentDTO, CommentDTO } from 'src/app/_models/business';
import { MAX_LEN_COMMENT, MIN_LEN_COMMENT } from '../../constants';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { RatingService } from 'src/app/_services/rating.service';
import { getHttpErrorMessage } from 'src/app/_helpers/miscelaneous';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {

  public readonly MAX_LEN_COMMENT = MAX_LEN_COMMENT;
  public readonly MIN_LEN_COMMENT = MIN_LEN_COMMENT;
  public content : string;
  public isProcessing : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommentDTO,
    public dialogRef: MatDialogRef<EditCommentComponent>,
    private snackbarService: SnackbarService,
    private ratingService: RatingService,
  ) {
    this.content = data.content.trim();
  }

  async onOk() {
    let newComment = new CommentContentDTO;
    newComment.commentId = this.data.commentId;
    newComment.content = this.content;
    if(!newComment.content){
      this.snackbarService.showErrorMessage("Comentario tiene que tener contenido.");
      return;
    }
    this.ratingService.editComment(newComment).subscribe({
      next: _res => {
        this.dialogRef.close(newComment);
        this.snackbarService.showSuccessMessage("Comentario editado exitosamente.")
      }
    })
  }

}
