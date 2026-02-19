import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../interface/user.model';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  public user = inject<User>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<UserDetail>);

  private dialog = inject(MatDialog); 
  private authService = inject(AuthService);

  constructor() {
    console.log('Usuário recebido no modal:', this.user);
  }

  public currentUser = this.authService.currentUser();
  
  public isOwnProfile = signal(this.currentUser?.id === this.user.id);

  close(): void {
    this.dialogRef.close();
  }

  startChat(): void {
    if (!this.currentUser) return; 

    this.dialog.open(Chat, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        targetUser: this.user,
        currentUser: this.currentUser
      }
    });
    this.close();
  }

  get userPhoto(): string {
    if (this.user?.fotoUrl) {
      return this.user.fotoUrl;
    }
    return this.user?.tipo === 'empresa'
      ? 'assets/icon-company.png'
      : 'assets/icon-user.png';
  }
}
