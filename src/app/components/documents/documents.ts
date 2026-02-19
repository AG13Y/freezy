import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserDocument } from '../../interface/document.model';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteProject } from '../../modals/delete-project/delete-project';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule, 
    DatePipe, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatListModule,
    MatSnackBarModule,
    MatDialogModule 
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  public documents = signal<UserDocument[]>([]);
  public isLoading = signal(true);
  public isUploading = signal(false);

  ngOnInit(): void {
    this.loadDocuments();
  }
  
  private user = this.authService.currentUser()!;


  loadDocuments(): void {
    this.isLoading.set(true);
    
    const currentUser = this.authService.currentUser();

    if (currentUser) {
      this.storageService.getDocuments(currentUser.id).subscribe(docs => {
        this.documents.set(docs);
        this.isLoading.set(false);
      });
    } else {
      this.snackBar.open('Erro: Usuário não encontrado.', 'Fechar', { duration: 3000 });
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('Arquivo muito grande (máx 10MB).', 'Fechar', { duration: 3000 });
      return;
    }
    

    this.isUploading.set(true);

    this.storageService.uploadDocument(file).subscribe({
      next: (newDoc) => {
        this.documents.update(docs => [...docs, newDoc]);
        this.snackBar.open('Documento enviado com sucesso!', 'OK', { duration: 3000 });
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erro ao enviar documento.', 'Fechar', { duration: 3000 });
        this.isUploading.set(false);
      }
    });
  }

  deleteDocument(doc: UserDocument): void {
    const dialogRef = this.dialog.open(DeleteProject, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o documento "${doc.fileName}"?`,
        confirmButtonText: 'Excluir',
        confirmButtonColor: 'warn' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.storageService.deleteDocument(doc).subscribe({
          next: () => {
            this.documents.update(docs => docs.filter(d => d.id !== doc.id));
            this.snackBar.open('Documento excluído.', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Erro ao excluir documento.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
