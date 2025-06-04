import { Component, inject, signal } from '@angular/core';
import { ProfileCardComponent } from "../../../components/Shared/profile-card/profile-card.component";
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-account',
    imports: [ProfileCardComponent],
    templateUrl: './account.component.html',
    styleUrl: './account.component.css'
})
export class AccountComponent {
    private usersService = inject(UsersService);
    private toastService = inject(ToastService);
    private auth = inject(Auth);
    userId: any;
    address = signal<any>([]);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.auth.onAuthStateChanged((user) => {
            this.userId = user?.uid;
            console.log(this.userId)
            this.fetchUser();
        });
    }

    fetchUser() {
        this.usersService.getUser(this.userId).subscribe(data => {
            const userData = data[0];
            this.address.set(userData?.address);
        });
    }

    addAddress(newAddress: any) {
        this.loading.set(true);
        this.address.update(addresses => [...addresses, newAddress]);
        this.usersService.updateUser(this.userId, { address: this.address() }).subscribe({
            next: (response) => {
                console.log(response);
                this.toastService.showMessage('success', 'Success', 'Address added successfully');
                setTimeout(() => {
                    this.loading.set(false);
                }, 1500);
            },
            error: (error) => {
                this.toastService.showMessage('error', 'Error', error.error.message);
                console.error('Error adding address:', error.error);
                setTimeout(() => {
                    this.loading.set(false);
                }, 1500);
            }
        });
    };

    updateAddress(selectedAddress: any) {
        this.loading.set(true);
        const updatedAddresses = this.address().map((address: any) =>
            address.id === selectedAddress.id ? selectedAddress : address
        );
        // Update the address signal with the modified addresses
        this.address.set(updatedAddresses);
        this.usersService.updateUser(this.userId, { address: updatedAddresses }).subscribe({
            next: (response) => {
                console.log(response);
                this.toastService.showMessage('success', 'Success', 'Address Update successfully');
                setTimeout(() => {
                    this.loading.set(false);
                }, 1500);
            },
            error: (error) => {
                this.toastService.showMessage('error', 'Error', error.error.message);
                // this.toastService.showMessage('error', 'Error', 'Failed to update address');
                console.error('Error Update address:', error.error);
                setTimeout(() => {
                    this.loading.set(false);
                }, 1500);
            }
        });
    }

}
