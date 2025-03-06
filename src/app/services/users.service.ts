import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  http = inject(HttpClient);

  addUser(model: any | FormData): Observable<void> {
    return this.http.post<void>('http://localhost:3000/users', model);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users');
  }

  // getUser(id: string): Observable<any> {
  //   return this.http.get<any>(`http://localhost:3000/users/${id}`);
  // }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users?userId=${id}`);
  }

  updateUser(id: string, updateUserRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/users/${id}`, updateUserRequest);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/users/${id}`);
  }
}
