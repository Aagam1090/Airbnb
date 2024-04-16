import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-review-modal',
  templateUrl: './update-review-modal.component.html',
  styleUrls: ['./update-review-modal.component.css']
})
export class UpdateReviewModalComponent implements OnInit {
  updateForm = new FormGroup({
    reviewer_name: new FormControl('', [Validators.required]),
    comments: new FormControl('', [Validators.required]),
    city: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.updateForm.setValue({
      reviewer_name: this.data.reviewer_name,
      comments: this.data.comments,
      city: this.data.city
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
