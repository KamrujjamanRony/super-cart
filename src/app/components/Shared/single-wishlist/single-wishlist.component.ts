import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { WishListService } from '../../../services/user/wish-list.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../primeng/toast/toast.service';

@Component({
  selector: 'app-single-wishlist',
  imports: [RouterLink],
  templateUrl: './single-wishlist.component.html',
  styleUrl: './single-wishlist.component.css'
})
export class SingleWishlistComponent {
  @Input() product: any;
  @Input() userWishlist: any;
  @Output() cartUpdated = new EventEmitter<any>();
  wishListService = inject(WishListService);
  toastService = inject(ToastService);

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  deleteCart(selected: any) {

    if (!this.userWishlist) {
      console.error('User not logged in');
      this.toastService.showMessage('warn', 'Warning', 'User not logged in!');
      return;
    }

    if (this.userWishlist) {
      const updatedCart = {
        ...this.userWishlist,
        products: this.userWishlist.products.filter((p: any) => p.id !== selected.id),
      };

      this.wishListService.updateWishlist(this.userWishlist.id, updatedCart).subscribe({
        next: (response) => {
          console.log('Cart deleted successfully');
          this.toastService.showMessage('success', 'Success', 'Cart deleted successfully');
          this.cartUpdated.emit(updatedCart.products); // Emit updated products array
        },
        error: (error) => {
          console.error('Error deleting cart:', error);
          this.toastService.showMessage('error', 'Error', error.error.message);
        },
        complete: () => {
          console.log('Delete cart operation completed');
          this.toastService.showMessage('success', 'Success', 'Delete cart operation completed.');
        }
      });
    } else {
      this.toastService.showMessage('warn', 'Warning', 'No cart found to delete');
      console.log('No cart found to delete');
    }
  }

}
