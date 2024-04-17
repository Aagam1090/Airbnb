import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-review-modal',
  templateUrl: './add-review-modal.component.html',
  styleUrls: ['./add-review-modal.component.css']
})
export class AddReviewModalComponent {
  public reviewerName: string;
  addForm = new FormGroup({
    comments: new FormControl('', [Validators.required]),
    // Add other controls as necessary
  });

  constructor(
    public dialogRef: MatDialogRef<AddReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.reviewerName = data.reviewerName;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
