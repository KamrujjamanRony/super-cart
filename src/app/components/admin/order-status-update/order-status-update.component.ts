import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-status-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-status-update.component.html'
})
export class OrderStatusUpdateComponent {
  @Input() currentStatus!: any;
  @Input() order!: any;
  @Output() statusUpdated = new EventEmitter<any>();

  newStatus: number = this.currentStatus;
  showModal = false;

  statusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Processing' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' }
  ];

  openModal() {
    this.newStatus = this.currentStatus;
    this.showModal = true;
  }

  updateStatus() {
    this.statusUpdated.emit({ body: this.order, status: +this.newStatus });
    this.showModal = false;
  }

  getStatusLabel(status: any): string {
    return this.statusOptions.find(opt => opt.value === status)?.label || '';
  }
}