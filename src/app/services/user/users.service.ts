import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/ECommerceUser';

  addUser(model: any): Observable<any> {
    return this.http.post(this.baseApiUrl, model,
      { responseType: 'text' })
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(`${this.baseApiUrl}`)
  }

  getUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/${id}`);
  }

  updateUser(id: any, updateRequest: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/${id}`, updateRequest,
      { responseType: 'text' });
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${id}`);
  }
}
