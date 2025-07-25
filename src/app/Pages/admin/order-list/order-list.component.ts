import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/user/order.service';
import { OrderListFilterComponent } from "../../../components/admin/order-list-filter/order-list-filter.component";
import { FormsModule } from '@angular/forms';
import { ShortenPipe } from "../../../pipes/shorten.pipe";
import { OrderStatusUpdateComponent } from "../../../components/admin/order-status-update/order-status-update.component";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    OrderListFilterComponent,
    OrderStatusUpdateComponent,
    ShortenPipe
  ]
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];

  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Processing' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' }
  ];
  isLoading = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(filters: any = {}): void {
    this.isLoading = true;
    this.error = '';

    const from = filters.fromDate ? this.datePipe.transform(filters.fromDate, 'yyyy-MM-dd') : '';
    const to = filters.toDate ? this.datePipe.transform(filters.toDate, 'yyyy-MM-dd') : '';

    this.orderService.getAllOrders(from, to, filters.status).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  onStatusUpdated(updateRequest: any): void {
    this.orderService.updateOrderStatus(updateRequest.body, updateRequest.status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.filteredOrders = [...this.orders];
        }
        this.showNotification('Order status updated successfully');
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.showNotification('Failed to update order status', 'error');
      }
    });
  }

  getStatusClass(status: any): string {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-indigo-100 text-indigo-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: any): string {
    return this.statusOptions.find(opt => opt.value === status)?.label || '';
  }

  viewOrderDetails(order: any): void {
    // Implement view details functionality
    console.log('View order:', order);
  }

  editOrder(order: any): void {
    // Implement edit functionality
    console.log('Edit order:', order);
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    // Implement notification logic
    console.log(`${type}: ${message}`);
  }
}