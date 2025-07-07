import { Component, inject, signal } from '@angular/core';
import { ProfileCardComponent } from '../../../components/Shared/profile-card/profile-card.component';
import { UsersService } from '../../../services/user/users.service';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AddressModalComponent } from '../../../components/Shared/address-modal/address-modal.component';

@Component({
  selector: 'app-user-address',
  imports: [CommonModule, ProfileCardComponent, AddressModalComponent],
  templateUrl: './user-address.component.html',
  styleUrl: './user-address.component.css'
})
export class UserAddressComponent {
  private usersService = inject(UsersService);
  private toastService = inject(ToastService);
  private auth = inject(Auth);

  userId: string | null = null;
  userData = signal<any>({});
  address = signal<any[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  selectedId = signal<any>(null);
  selectedAddress = signal<any>(null);
  isEditMode = signal<boolean>(false);

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.userId = user?.uid ?? null;
      if (this.userId) {
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    this.loading.set(true);
    this.usersService.getUser(this.userId!).subscribe({
      next: (data) => {
        this.userData.set(data);
        this.selectedId.set(data.id);
        this.address.set(data?.address || []);
        this.loading.set(false);
      },
      error: (error) => {
        this.toastService.showMessage('error', 'Error', 'Failed to fetch user data');
        console.error('Error fetching user:', error);
        this.loading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.selectedAddress.set(null);
    this.showModal.set(true);
  }

  openEditModal(address: any) {
    this.isEditMode.set(true);
    this.selectedAddress.set(address);
    this.showModal.set(true);
  }

  handleModalSubmit(addressData: any) {
    if (this.isEditMode()) {
      this.updateAddress(addressData);
    } else {
      this.addAddress(addressData);
    }
    this.showModal.set(false);
  }

  addAddress(newAddress: any) {
    this.loading.set(true);
    const newAddressWithId = {
      ...newAddress,
      id: crypto.randomUUID(),
      userId: this.userId
    };

    const updatedAddresses = [...this.address(), newAddressWithId];
    this.updateUserAddresses(updatedAddresses, 'Address added successfully');
  }

  updateAddress(updatedAddress: any) {
    this.loading.set(true);
    const updatedAddresses = this.address().map(address =>
      address.id === updatedAddress.id ? updatedAddress : address
    );
    this.updateUserAddresses(updatedAddresses, 'Address updated successfully');
  }

  deleteAddress(addressId: string) {
    this.loading.set(true);
    const updatedAddresses = this.address().filter(address => address.id !== addressId);

    // Prevent deleting all addresses if one exists
    if (updatedAddresses.length === 0) {
      this.toastService.showMessage('error', 'Error', 'You must have at least one address');
      this.loading.set(false);
      return;
    }

    // If deleting default address, set the first remaining as default
    const wasDefault = this.address().find(a => a.id === addressId)?.isDefault;
    if (wasDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    this.updateUserAddresses(updatedAddresses, 'Address deleted successfully');
  }

  setDefaultAddress(addressId: string) {
    this.loading.set(true);
    const updatedAddresses = this.address().map(address => ({
      ...address,
      isDefault: address.id === addressId
    }));
    this.updateUserAddresses(updatedAddresses, 'Default address updated');
  }

  private updateUserAddresses(addresses: any[], successMessage: string) {
    this.usersService.updateUser(this.selectedId()!, {
      ...this.userData(),
      address: addresses
    }).subscribe({
      next: () => {
        this.address.set(addresses);
        this.toastService.showMessage('success', 'Success', successMessage);
        this.loading.set(false);
      },
      error: (error) => {
        this.toastService.showMessage('error', 'Error', error.error?.message || 'Operation failed');
        console.error('Error:', error);
        this.loading.set(false);
      }
    });
  }


  closeModal() {
    this.showModal.set(false);
  }
}