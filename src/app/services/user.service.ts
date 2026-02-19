import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, UserWithPassword } from '../interface/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';


  getUsers(): Observable<User[]> {
    return this.http.get<UserWithPassword[]>(this.apiUrl).pipe(

      map(users => 
        users.map(u => {
          const { password, ...user } = u; 
          return user; 
        })
      )
    );
  }

  getUserById(id: string | number): Observable<User> {
    return this.http.get<UserWithPassword>(`${this.apiUrl}/${id}`).pipe(
      map(userWithPassword => {
        const { password, ...user } = userWithPassword;
        return user;
      })
    );
  }
  
  updateUser(id: string | number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }
}