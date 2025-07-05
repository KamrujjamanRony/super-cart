import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/Brand';

  addBrand(model: any): Observable<any> {
    return this.http.post<void>(this.baseApiUrl, model)
  }

  getBrand(): Observable<any> {
    return this.http.get<any[]>(`${this.baseApiUrl}`)
  }

  updateBrand(id: any, updateRequest: any): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/${id}`, updateRequest);
  }

  deleteBrand(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${id}`);
  }
}
