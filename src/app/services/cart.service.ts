import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  http = inject(HttpClient);

  addCart(model: any | FormData): Observable<void>{
    return this.http.post<void>('http://localhost:3000/carts', model)
  }

  getAllCarts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/carts');
  }

  getCart(id: string): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/carts?userId=${id}`);
  }

  updateCart(id: string, updateCartRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`http://localhost:3000/carts/${id}`, updateCartRequest);
  }

  deleteCart(id: string): Observable<any>{
    return this.http.delete<any>(`http://localhost:3000/carts/${id}`);
  }
}
