import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentContentDTO, CommentDTO } from 'src/app/_models/business';
import { MAX_LEN_COMMENT, MIN_LEN_COMMENT } from '../../constants';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {

  public readonly MAX_LEN_COMMENT = MAX_LEN_COMMENT;
  public readonly MIN_LEN_COMMENT = MIN_LEN_COMMENT;
  public content : string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommentDTO,
    public dialogRef: MatDialogRef<EditCommentComponent>
  ) {
    this.content = data.content.trim();
  }

  onOk() {
    let newComment = new CommentContentDTO;
    newComment.commentId = this.data.commentId;
    newComment.content = this.content;
    this.dialogRef.close(newComment);
  }

}
