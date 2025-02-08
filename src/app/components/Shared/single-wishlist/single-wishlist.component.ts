import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { WishListService } from '../../../services/wish-list.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../toast/toast.service';

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
      this.toastService.createToast('User not logged in', 'warning');
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
          this.toastService.createToast('Cart deleted successfully', 'success');
          this.cartUpdated.emit(updatedCart.products); // Emit updated products array
        },
        error: (error) => {
          console.error('Error deleting cart:', error);
          this.toastService.createToast('Error deleting cart.', 'error');
        },
        complete: () => {
          console.log('Delete cart operation completed');
          this.toastService.createToast('Delete cart operation completed.', 'success');
        }
      });
    } else {
      this.toastService.createToast('No cart found to delete', 'warning');
      console.log('No cart found to delete');
    }
  }

}
