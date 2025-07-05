import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/Category';

  addCategory(model: any): Observable<any> {
    return this.http.post<void>(this.baseApiUrl, model)
  }

  getCategory(): Observable<any> {
    return this.http.get<any[]>(`${this.baseApiUrl}`)
  }

  updateCategory(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/${id}`, updateRequest);
  }

  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${id}`);
  }
}
