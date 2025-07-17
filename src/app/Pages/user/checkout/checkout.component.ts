// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/user/cart.service';
import { OrderService } from '../../../services/user/order.service';
import { UsersService } from '../../../services/user/users.service'; // Add this import
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { BdtPipe } from "../../../pipes/bdt.pipe"; // Add this import

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, BdtPipe],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    orderData: any;
    user: any;
    userDetails: any;
    loading = false;
    error: string | null = null;
    paymentMethod: string = 'Cash on Delivery';
    deliveryCharge: number = 120; // Set your delivery charge
    deliveryAddress: any = null; // Changed from {} to null
    userAddresses: any[] = []; // To store user addresses
    selectedAddressId: string | null = null;

    constructor(
        private router: Router,
        private cartService: CartService,
        private orderService: OrderService,
        private usersService: UsersService, // Add this
        private toastService: ToastService, // Add this
        private auth: Auth
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.orderData = navigation?.extras.state?.['orderData'] ||
            history.state?.orderData;
    }

    ngOnInit() {
        this.auth.onAuthStateChanged((user) => {
            this.user = user;
            if (user) {
                this.loadUserDetails(user.uid);
            }
        });
    }

    loadUserDetails(userId: string) {
        this.loading = true;
        this.usersService.getUser(userId).subscribe({
            next: (data) => {
                this.userDetails = data;
                this.userAddresses = data?.address || [];

                // Set default address if available
                const defaultAddress = this.userAddresses.find(addr => addr.isDefault);
                if (defaultAddress) {
                    this.deliveryAddress = defaultAddress;
                    this.selectedAddressId = defaultAddress.id;
                } else if (this.userAddresses.length > 0) {
                    this.deliveryAddress = this.userAddresses[0];
                    this.selectedAddressId = this.userAddresses[0].id;
                }

                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load user details:', err);
                this.error = 'Failed to load user details';
                this.loading = false;
            }
        });
    }

    selectAddress(addressId: string) {
        const selected = this.userAddresses.find(addr => addr.id === addressId);
        if (selected) {
            this.deliveryAddress = selected;
            this.selectedAddressId = addressId;
        }
    }

    async placeOrder() {
        if (!this.user) {
            this.error = 'Please login to place an order';
            return;
        }

        if (!this.deliveryAddress) {
            this.error = 'Please select a delivery address';
            return;
        }

        if (!this.orderData?.products?.length) {
            this.error = 'No products in cart';
            return;
        }

        this.loading = true;
        this.error = null;

        const orderItems = this.orderData.products.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            size: item.selectSize,
            color: item.selectColor,
            image: item.image
        }));

        const order = {
            userId: this.user.uid,
            userEmail: this.user.email,
            userName: this.userDetails?.fullname || '',
            userPhone: this.deliveryAddress.contact,
            orderItems,
            subtotal: this.orderData.subtotal,
            deliveryCharge: this.deliveryCharge,
            totalAmount: this.orderData.subtotal + this.deliveryCharge,
            paymentMethod: this.paymentMethod,
            orderStatus: 'Pending',
            shippingAddress: {
                id: this.deliveryAddress.id,
                city: this.deliveryAddress.city,
                street: this.deliveryAddress.street,
                contact: this.deliveryAddress.contact,
                type: this.deliveryAddress.type,
                isDefault: this.deliveryAddress.isDefault
            },
            orderDate: new Date().toISOString()
        };

        try {
            const response = await this.orderService.createOrder(order).toPromise();
            await this.cartService.clearCart(this.user.uid).toPromise();
            this.router.navigate(['/order-confirmation'], {
                state: { orderId: response.orderId }
            });
        } catch (err) {
            console.error('Order failed:', err);
            this.toastService.showMessage('error', 'Error', 'Failed to place order');
            this.error = 'Failed to place order. Please try again.';
        } finally {
            this.loading = false;
        }
    }
}