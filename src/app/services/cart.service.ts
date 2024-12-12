import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUpdated = new BehaviorSubject<void>(undefined);
  cartUpdated$ = this.cartUpdated.asObservable();

  http = inject(HttpClient);

  apiUrl = 'http://localhost:3000/carts';

  addCart(model: any | FormData): Observable<void>{
    console.log(model)
    return this.http.post<void>(this.apiUrl, model).pipe(
      tap(() => this.cartUpdated.next()) // Notify subscribers of cart update
    );
  }

  getAllCarts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCart(id: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}?userId=${id}`);
  }

  updateCart(cartId: string, updateCartRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${cartId}`, updateCartRequest).pipe(
      tap(() => this.cartUpdated.next()) // Notify subscribers
    );
  }

  deleteCart(id: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cartUpdated.next()) // Notify subscribers of cart update
    );
  }
}
