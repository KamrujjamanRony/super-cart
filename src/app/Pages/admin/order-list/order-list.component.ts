import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/user/order.service';
import { OrderListFilterComponent } from "../../../components/admin/order-list-filter/order-list-filter.component";
import { FormsModule } from '@angular/forms';
import { OrderStatusUpdateComponent } from "../../../components/admin/order-status-update/order-status-update.component";
import { BdtPipe } from "../../../pipes/bdt.pipe";
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { AuthService } from '../../../services/admin/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderFormComponent } from "../order-form/order-form.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRemove, faPencil, faEye } from '@fortawesome/free-solid-svg-icons';
import { OrderDetailsComponent } from "../../../components/admin/order-details/order-details.component";

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
    BdtPipe,
    OrderFormComponent, FontAwesomeModule,
    OrderDetailsComponent
  ]
})
export class OrderListComponent implements OnInit {
  faRemove = faRemove;
  faPencil = faPencil;
  faEye = faEye;
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private datePipe = inject(DatePipe);
  private toastService = inject(ToastService);

  isView = signal<boolean>(false);
  isInsert = signal<boolean>(false);
  isEdit = signal<boolean>(false);
  isDelete = signal<boolean>(false);

  orders = signal<any[]>([]);
  filteredOrders = signal<any[]>([]);
  selectedOrder = signal<any>(null);
  showModal = false;
  viewMode: 'details' | 'form' = 'details';
  modalTitle = 'Order Details';

  private searchQuery$ = new BehaviorSubject<string>('');
  isLoading$: Observable<boolean> | undefined;
  hasError$: Observable<boolean> | undefined;

  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Processing' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' }
  ];
  isLoading = false;
  error = '';

  ngOnInit(): void {
    this.loadOrders();
    this.isView.set(this.checkPermission("Orders", "View"));
    this.isInsert.set(this.checkPermission("Orders", "Insert"));
    this.isEdit.set(this.checkPermission("Orders", "Edit"));
    this.isDelete.set(this.checkPermission("Orders", "Delete"));
  }

  loadOrders(filters: any = {}): void {
    this.isLoading = true;
    this.error = '';

    const from = filters.fromDate ? this.datePipe.transform(filters.fromDate, 'yyyy-MM-dd') : '';
    const to = filters.toDate ? this.datePipe.transform(filters.toDate, 'yyyy-MM-dd') : '';
    // Calculate default dates if not provided
    const today = new Date();
    // Set default fromDate (today - 2 days)
    const defaultFrom = new Date();
    defaultFrom.setDate(today.getDate());
    // Set default toDate (today + 1 day)
    const defaultTo = new Date(to || from || today);
    defaultTo.setDate(today.getDate() + 1);
    // Format dates as strings (adjust format as needed)
    const formatDate = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const reqBody: any = {
      fromDate: from || formatDate(defaultFrom),
      toDate: formatDate(defaultTo)
    };

    this.orderService.getAllOrders(reqBody, filters.status).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.filteredOrders.set([...orders]);
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
    this.orderService.updateOrderStatus(updateRequest.id, updateRequest.status).subscribe({
      next: (updatedOrder) => {
        this.loadOrders();
        this.toastService.showMessage('success', 'Success', 'Order status updated successfully!');
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.toastService.showMessage('error', 'Error', `Failed to update order status: ${err.error.message || err.error.title}`);
      }
    });
  }

  onSearchOrders(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery$.next(query);
  }

  openAddModal() {
    this.modalTitle = 'Add New Order';
    this.selectedOrder.set(null);
    this.showModal = true;
  }

  viewOrderDetails(order: any) {
    this.modalTitle = 'Order Details';
    this.viewMode = 'details';
    this.selectedOrder.set(order);
    this.showModal = true;
  }

  openEditModal(order: any) {
    this.modalTitle = 'Edit Order';
    this.viewMode = 'form';
    this.selectedOrder.set(order);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder.set(null);
  }

  handleFormSubmit(formData: any) {
    if (this.selectedOrder()) {
      this.orderService.updateOrder(this.selectedOrder().id, formData).subscribe({
        next: (updatedOrder) => {
          this.orders.update(orders =>
            orders.map(order => order.Id === updatedOrder.Id ? updatedOrder : order)
          );
          this.filteredOrders.update(orders =>
            orders.map(order => order.Id === updatedOrder.Id ? updatedOrder : order)
          );
          this.toastService.showMessage('success', 'Success', 'Order updated successfully');
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.toastService.showMessage('error', 'Error', 'Failed to update order');
        }
      });
    } else {
      this.orderService.createOrder(formData).subscribe({
        next: (newOrder) => {
          this.orders.update(orders => [newOrder, ...orders]);
          this.filteredOrders.update(orders => [newOrder, ...orders]);
          this.toastService.showMessage('success', 'Success', 'Order created successfully');
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          this.toastService.showMessage('error', 'Error', 'Failed to create order');
        }
      });
    }
  }

  deleteOrder(order: any) {
    if (confirm(`Are you sure you want to delete order #${order.id}?`)) {
      // console.log(`Deleting order with ID: ${order.id}`);
      this.orderService.deleteOrder(order.id).subscribe({
        next: (response) => {
          // Check if response is the expected "Deleted" string
          if (response === 'Deleted') {
            this.orders.update(orders => orders.filter(o => o.id !== order.id));
            this.filteredOrders.update(orders => orders.filter(o => o.id !== order.id));
            this.toastService.showMessage('success', 'Success', 'Order deleted successfully');
          } else {
            console.warn('Unexpected delete response:', response);
            this.toastService.showMessage('warn', 'Warning', 'Order deletion completed with unexpected response');
          }
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          this.toastService.showMessage('error', 'Error', 'Failed to delete order');
        }
      });
    }
  }

  checkPermission(moduleName: string, permission: string) {
    const modulePermission = this.authService.getUser()?.userMenu?.find(
      (module: any) => module?.menuName?.toLowerCase() === moduleName.toLowerCase()
    );
    return modulePermission?.permissions?.some(
      (perm: any) => perm.toLowerCase() === permission.toLowerCase()
    ) || false;
  }
}