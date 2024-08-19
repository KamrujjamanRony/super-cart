import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);

  addProduct(model: any | FormData): Observable<void>{
    return this.http.post<void>('http://localhost:3000/products', model)
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/products');
  }

  getProduct(id: string): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(id: string, updateProductRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`http://localhost:3000/products/${id}`, updateProductRequest);
  }

  deleteProduct(id: string): Observable<any>{
    return this.http.delete<any>(`http://localhost:3000/products/${id}`);
  }
}
