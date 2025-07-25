import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list-filter.component.html'
})
export class OrderListFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  statusFilter: any = null;
  fromDate: string = '';
  toDate: string = '';

  statusOptions = [
    { value: null, label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  applyFilters() {
    this.filterChanged.emit({
      status: this.statusFilter,
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  resetFilters() {
    this.statusFilter = null;
    this.fromDate = '';
    this.toDate = '';
    this.applyFilters();
  }
}