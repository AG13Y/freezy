import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-termos',
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './termos.html',
  styleUrl: './termos.scss',
})
export class Termos {
  // 3. Injetar a referência do Dialog para podermos fechá-lo
  private dialogRef = inject(MatDialogRef<Termos>);

  /**
   * 4. Criar a função de fechar
   */
  close(): void {
    this.dialogRef.close();
  }
}
