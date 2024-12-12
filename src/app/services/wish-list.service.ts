import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private wishlistUpdated = new BehaviorSubject<void>(undefined);
  wishlistUpdated$ = this.wishlistUpdated.asObservable();

  http = inject(HttpClient);

  apiUrl = 'http://localhost:3000/wishlist';

  addWishlist(model: any | FormData): Observable<void>{
    console.log(model)
    return this.http.post<void>(this.apiUrl, model).pipe(
      tap(() => this.wishlistUpdated.next()) // Notify subscribers of Wishlist update
    );
  }

  getAllWishlists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getWishlist(id: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}?userId=${id}`);
  }

  updateWishlist(id: string, updateWishlistRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateWishlistRequest).pipe(
      tap(() => this.wishlistUpdated.next()) // Notify subscribers
    );
  }

  deleteWishlist(id: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.wishlistUpdated.next()) // Notify subscribers of Wishlist update
    );
  }
}
