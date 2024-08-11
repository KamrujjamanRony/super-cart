import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  addProduct(model: any | FormData): Observable<void>{
    return this.http.post<void>('http://localhost:3000/products', model)
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/products');
  }

  getCompanyProduct(companyID: any): Observable<any[]> {
    return this.getAllProducts().pipe(
      map(Product => Product.filter(data => data.companyID == companyID))
    );
  }

  getProduct(id: string): Observable<any>{
    return this.http.get<any>(`${'http://localhost:3000/products'}/GetProductById?id=${id}`);
  }

  updateProduct(id: string, updateProductRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${'http://localhost:3000/products'}/EditProduct/${id}`, updateProductRequest);
  }

  deleteProduct(id: string): Observable<any>{
    return this.http.delete<any>(`${'http://localhost:3000/products'}/DeleteProduct?id=${id}`);
  }
}
