// product.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/api/Product';

  addProduct(model: any | FormData): Observable<void> {
    return this.http.post<void>(this.baseApiUrl, model);
  }

  getProducts(query: string = '', category: string = '', brand: string = ''): Observable<any[]> {
    const queryParams = {
      search: query,
      category: category,
      brand: brand
    }
    return this.http.post<any[]>(`${this.baseApiUrl}/search`, queryParams);
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

  getRelatedProducts(productId: number): Observable<any[]> {
    return this.getProducts().pipe(
      map(products => {
        const mainProduct = products.find(p => p.id === productId);
        if (!mainProduct?.relatedProducts) return [];
        return products.filter(p =>
          mainProduct.relatedProducts.includes(p.id) &&
          p.id !== productId
        );
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}/categories`);
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseApiUrl}/brands`);
  }
}