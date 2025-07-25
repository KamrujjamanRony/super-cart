import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/Orders`;

    constructor(private http: HttpClient) { }

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, order);
    }

    getAllOrders(from?: any, to?: any, status?: any): Observable<any[]> {
        // Calculate default dates if not provided
        const today = new Date();
        // Set default fromDate (today - 2 days)
        const defaultFrom = new Date(today);
        defaultFrom.setDate(today.getDate() - 2);
        // Set default toDate (today + 1 day)
        const defaultTo = new Date(today);
        defaultTo.setDate(today.getDate() + 1);
        // Format dates as strings (adjust format as needed)
        const formatDate = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const reqBody: any = {
            fromDate: from || formatDate(defaultFrom),
            toDate: to || formatDate(defaultTo)
        };
        // Add status to request body only if it's provided
        if (status !== undefined && status !== null) {
            reqBody.status = status;
        }
        return this.http.post<any[]>(`${this.apiUrl}/searchOrder`, reqBody);
    }

    getOrdersByUser(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
    }

    getOrderById(orderId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/order/${orderId}`);
    }

    updateOrderStatus(request: any, status: number): Observable<any> {
        console.log(request)
        // Prepare update data
        const updateData: Partial<any> = {
            ...request,
            orderStatus: status
        };

        // If status is 'delivered', set the delivered date to current time
        if (request.status === 'delivered') {
            updateData['deliveredDate'] = new Date().toISOString();
        }
        console.log(updateData)

        return this.updateOrder(request.id, updateData);
    }

    updateOrder(id: string, updateRequest: Partial<any>): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, updateRequest);
    }

    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}