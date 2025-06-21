import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/Product';

  addProduct(model: any | FormData): Observable<void> {
    return this.http.post<void>(this.baseApiUrl, model)
  }

  getAllProducts(query: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/search?search=${query}`);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/${id}`);
  }

  updateProduct(id: string, updateProductRequest: any | FormData): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/${id}`, updateProductRequest);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${id}`);
  }
}
