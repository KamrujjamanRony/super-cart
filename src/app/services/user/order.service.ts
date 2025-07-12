// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/Order`;

    constructor(private http: HttpClient) { }

    createOrder(order: any): Observable<any> {
        return this.http.post(this.apiUrl, order);
    }

    getOrders(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${userId}`);
    }

    getOrderById(orderId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${orderId}`);
    }
}