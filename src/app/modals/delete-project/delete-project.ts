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
  selector: 'app-delete-project',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-project.html',
  styleUrl: './delete-project.scss',
})
export class DeleteProject {
  public data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  
  private dialogRef = inject(MatDialogRef<DeleteProject>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
