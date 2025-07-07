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

  apiUrl = 'http://supersoft:81/api/Cart';

  addCart(model: any | FormData): Observable<void> {
    return this.http.post<void>(this.apiUrl, model).pipe(
      tap(() => this.cartUpdated.next()) // Notify subscribers of cart update
    );
  }

  getCart(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateCart(cartId: string, updateCartRequest: any | FormData): Observable<string> {
    return this.http.put(`${this.apiUrl}/${cartId}`, updateCartRequest,
      { responseType: 'text' }).pipe(
        tap(() => this.cartUpdated.next()) // Notify subscribers
      );
  }

  deleteCart(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cartUpdated.next()) // Notify subscribers of cart update
    );
  }
}
