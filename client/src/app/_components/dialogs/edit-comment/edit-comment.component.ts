import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentContentDTO, CommentDTO } from 'src/app/_models/business';
import { MAX_LEN_COMMENT, MIN_LEN_COMMENT } from '../../constants';
import { firstValueFrom } from 'rxjs';
import { ApiResponseAxum, FilterRequest, WasmFilterService } from 'src/app/_services/wasmFilter.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

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
    private wasmFilterService: WasmFilterService
  ) {
    this.content = data.content.trim();
  }

  async onOk() {
    let newComment = new CommentContentDTO;
    newComment.commentId = this.data.commentId;
    newComment.content = this.content;
    // analyze if the name and lastname are not inappropiate first before saving to DB
    let filter: FilterRequest = {
      words: [newComment.content].filter(d => d && d.length>0)
    }
    let nexus_response: ApiResponseAxum = {
      message: "",
      is_inappropiate: true
    };
    this.isProcessing = true;
    await firstValueFrom(this.wasmFilterService.analyze_words(filter)).then( res => {
      if (res.is_inappropiate != null) {
        nexus_response = res;
      }
    });
    if (nexus_response.is_inappropiate) {
      this.snackbarService.showErrorMessage(nexus_response.message, 20_000);
      this.isProcessing = false;
    } else {
      this.dialogRef.close(newComment);
    }
  }

}
