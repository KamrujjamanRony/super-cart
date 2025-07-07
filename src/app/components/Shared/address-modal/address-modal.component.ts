// address-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-address-modal',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.css']
})
export class AddressModalComponent {
  @Input() address: any = null;
  @Input() isEditMode: boolean = false;
  @Output() submit = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  showModal = true; // Control visibility internally

  addressTypes = [
    { label: 'Home', value: 'Home' },
    { label: 'Work', value: 'Work' },
    { label: 'Other', value: 'Other' }
  ];

  formData: any = {
    city: '',
    street: '',
    contact: '',
    type: 'Home',
    isDefault: false
  };

  ngOnChanges() {
    if (this.address) {
      this.formData = { ...this.address };
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      this.submit.emit(this.formData);
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.formData = {
      city: '',
      street: '',
      contact: '',
      type: 'Home',
      isDefault: false
    };
  }

  private validateForm(): boolean {
    if (!this.formData.city || !this.formData.street || !this.formData.contact) {
      alert('Please fill all required fields');
      return false;
    }

    if (!/^\d{10,15}$/.test(this.formData.contact)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    return true;
  }
}