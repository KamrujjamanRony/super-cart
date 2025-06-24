import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/User';

  addUser(model: any): Observable<void> {
    return this.http.post<void>(this.baseApiUrl, model)
  }

  getUser(query: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/SearchUser?Search=${query}`, {});
  }

  updateUser(id: string | number, updateUserRequest: any): Observable<any> {
    const req = {
      ...updateUserRequest,
      userId: id
    }
    return this.http.put<any>(`${this.baseApiUrl}/EditUser/${id}?userId=${id}`, req);
  }

  deleteUser(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/DeleteUser?id=${id}`);
  }
}
