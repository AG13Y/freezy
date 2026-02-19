import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../interface/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatModel, Message } from '../../interface/chat.model';

interface ChatModalData {
  targetUser: User;
  currentUser: User;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private chatService = inject(ChatService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ChatModel>);
  public data: ChatModalData = inject(MAT_DIALOG_DATA);

  public targetUser = this.data.targetUser;
  public currentUser = this.data.currentUser;
  public chat = signal<ChatModel | null>(null);
  public messageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  onCallClick(): void {

    this.snackBar.open('Funcionalidade de chamada ainda não implementada.', 'Fechar', { 
      duration: 3000 
    });
  }
  
  ngOnInit(): void {
    this.chatService.getOrCreateChat(this.currentUser.id, this.targetUser.id).subscribe({
      next: (chat) => {
        this.chat.set(chat);
      },
      error: (err) => this.showError('Erro ao iniciar chat.')
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.messageControl.invalid) return;
    const currentChat = this.chat();
    if (!currentChat) return;

    const messageText = this.messageControl.value.trim();
    if (!messageText) {
      this.messageControl.reset();
      return;
    }
    this.messageControl.disable();

    this.chatService.sendMessage(currentChat.id, messageText, this.currentUser.id).subscribe({
      next: (chatFromServer) => {
        this.chat.set(chatFromServer);
        this.messageControl.reset();
        this.messageControl.enable();
        this.scrollToBottom(); 
      },
      error: (err) => {
        this.showError('Erro ao enviar mensagem.');
        this.messageControl.enable();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 0);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
