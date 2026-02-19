import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserWithPassword } from '../interface/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

type RegisterData = Pick<User, 'email' | 'nome' | 'tipo' | 'fotoUrl'> & { password: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    const storedUser = localStorage.getItem('freezy_user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    
    return this.http.get<UserWithPassword[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Email não encontrado.'); 
        }

        const userWithPassword = users[0];

        if (userWithPassword.password !== password) {
          throw new Error('Senha incorreta.');
        }
        
        const { password: pw, ...userFound } = userWithPassword;
        
        return userFound; 
      }),
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('freezy_user', JSON.stringify(user));
        this.router.navigateByUrl('/next-login');
      }),
      catchError(error => {
        console.error(error.message);
        return throwError(() => error); 
      })
    );
  }

 register(data: RegisterData): Observable<User> {
    const uid = `uid_${Math.random().toString(36).substring(2, 9)}`;
    const newUserApiPayload = {
      ...data, 
      uid: uid,
      fotoUrl: data.fotoUrl || 'icon-user.png' 
    };

    return this.http.post<UserWithPassword>(`${this.apiUrl}/users`, newUserApiPayload).pipe(
      map(createdUser => {
        const { password, ...userToStore } = createdUser;
        return userToStore;
      }),
      tap(userToStore => {
        localStorage.setItem('freezy_user', JSON.stringify(userToStore));
        this.currentUser.set(userToStore);
        this.router.navigateByUrl('/next-login');
      }),
      catchError(error => {
        console.error("Erro ao registrar na API:", error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('freezy_user');
    this.currentUser.set(null);
    this.router.navigateByUrl('/sign-pag');
  }

  public updateCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('freezy_user', JSON.stringify(user));
  }
}