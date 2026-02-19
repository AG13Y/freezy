import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs'; 
import { delay, switchMap } from 'rxjs/operators';
import { UserDocument } from '../interface/document.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private dbUrl = 'http://localhost:3000/documents'; 


  getDocuments(userId: string | number): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(`${this.dbUrl}?userId=${userId}`);
  }


  uploadDocument(file: File): Observable<UserDocument> {
    const user = this.authService.currentUser()!;
    
    const doc: Omit<UserDocument, 'id'> = {
      userId: user.id,
      fileName: file.name,
      fileType: file.type,
      downloadUrl: `http://fake-storage.com/user_documents/${user.id}/${file.name}`,
      uploadedAt: new Date().toISOString()
    };

    return of(null).pipe( 
      delay(1500),
      switchMap(() => {
        return this.http.post<UserDocument>(this.dbUrl, doc);
      })
    );
  }

  deleteDocument(doc: UserDocument): Observable<any> {
    return this.http.delete(`${this.dbUrl}/${doc.id}`);
  }
}