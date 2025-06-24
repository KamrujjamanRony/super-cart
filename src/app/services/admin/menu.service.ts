import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/Menu';

  addMenu(model: any): Observable<any> {
    return this.http.post<void>(this.baseApiUrl, model)
  }

  getAllMenu(): Observable<any> {
    return this.http.post<any[]>(`${this.baseApiUrl}/SearchMenu`, {})
  }

  getMenu(id: any): Observable<any> {
    return this.http.post<any[]>(`${this.baseApiUrl}/GetById/${id}`, {})
  }

  updateMenu(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/EditMenu/${id}`, updateRequest);
  }

  deleteMenu(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/DeleteMenu?id=${id}`);
  }

  generateTreeData(userId: any = ''): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/GenerateTreeData?userId=${userId}`);
  }
}
