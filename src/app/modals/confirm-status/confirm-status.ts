import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
}


@Component({
  selector: 'app-confirm-status',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './confirm-status.html',
  styleUrl: './confirm-status.scss',
})
export class ConfirmStatus {
  public data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  
  private dialogRef = inject(MatDialogRef<ConfirmStatus>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
