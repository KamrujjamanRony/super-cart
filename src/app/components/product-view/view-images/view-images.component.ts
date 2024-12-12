import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, Renderer2 } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ModalComponent } from "../../Shared/modal/modal.component";
import { AuthCookieService } from '../../../services/auth-cookie.service';

@Component({
    selector: 'app-view-images',
    imports: [CommonModule, ModalComponent],
    templateUrl: './view-images.component.html',
    styleUrl: './view-images.component.css'
})
export class ViewImagesComponent {
  cartService = inject(CartService);
  authCookieService = inject(AuthCookieService);
  renderer = inject(Renderer2);
  router = inject(Router);
  @Input() product: any;
  count: any = 1;
  viewImage: any;
  viewSize: any;
  viewColor: any;
  warningMsg: any;
  zoomStyle = {};

  ngOnInit() {
    this.scrollToTop();
  }

  resetWarningMsg(): void {
    this.warningMsg = null;
  }

  increase() {
    this.count++;
  }

  decrease() {
    this.count--;
  }

  onViewImageClick(img: any) {
    this.viewImage = img;
  }
  onViewSizeClick(size: any) {
    this.viewSize = size;
  }
  onViewColorClick(color: any) {
    this.viewColor = color;
  }

  trackByColor(index: number, color: string): string {
    return color;
  }

  // Function to generate an array of stars based on average rating
  getStarsArray(averageRating: number): boolean[] {
    const roundedRating = Math.round(averageRating * 2) / 2;
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  onMouseMove(event: MouseEvent): void {
    const imageContainer = (event.target as HTMLElement).closest('.image-container');
    const img = imageContainer?.querySelector('img') as HTMLImageElement;
    const zoom = imageContainer?.querySelector('.zoom') as HTMLDivElement;

    if (!img || !zoom || !imageContainer) return;

    const containerRect = imageContainer.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    const xPercent = (x / containerRect.width) * 100;
    const yPercent = (y / containerRect.height) * 100;

    // Ensure the zoom box stays within the image boundaries
    const zoomBoxWidth = zoom.offsetWidth;
    const zoomBoxHeight = zoom.offsetHeight;
    const zoomBoxLeft = Math.max(0, Math.min(x - zoomBoxWidth / 2, containerRect.width - zoomBoxWidth));
    const zoomBoxTop = Math.max(0, Math.min(y - zoomBoxHeight / 2, containerRect.height - zoomBoxHeight));

    this.zoomStyle = {
      display: 'block',
      backgroundImage: `url(${img.src})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      left: `${zoomBoxLeft}px`,
      top: `${zoomBoxTop}px`,
      backgroundSize: `${imgRect.width * 2}px ${imgRect.height * 2}px`,
    };
  }

  onMouseLeave(): void {
    this.zoomStyle = {
      display: 'none',
    };
  }

  addToCart(product: any) {
    const user = this.authCookieService.getUserData();
  
    if (!user) {
      console.error('User not logged in');
      return;
    }
  
    if ((!product?.sizes && !product?.colors) || 
        (product?.sizes && this.viewSize && !product?.colors) || 
        (product?.colors && this.viewColor && !product?.sizes) || 
        (product?.sizes && this.viewSize && product?.colors && this.viewColor)) {
      
      const cartProduct = { 
        id: crypto.randomUUID().toString(), 
        productId: product.id, 
        selectSize: this.viewSize, 
        selectColor: this.viewColor, 
        quantity: this.count 
      };
  
      this.cartService.getCart(user.uid).subscribe({
        next: (cart) => {
          console.log(cart)
          if (cart.length > 0) {
            const restCart = cart[0];
            // If the cart exists, check if the product is already in the cart
            const existingProduct = restCart.products.find((p: any) => p.productId === cartProduct.productId && p.selectSize === cartProduct.selectSize && p.selectColor === cartProduct.selectColor);
  
            if (existingProduct) {
              // Update the quantity if the product already exists
              existingProduct.quantity += cartProduct.quantity;
            } else {
              // Add the new product to the cart
              restCart.products.push(cartProduct);
            }
  
            // Update the cart
            this.cartService.updateCart( restCart.id, restCart).subscribe({
              next: () => {
                console.log('Cart updated successfully');
                // this.router.navigateByUrl('user/shopping-cart');
              },
              error: (error) => {
                console.error('Error updating cart:', error);
              }
            });
          } else {
            // If no cart exists, create a new cart for the user
            const newCart = {
              id: Date.now().toString(), // Generate a unique ID for the new cart
              userId: user.uid,
              products: [cartProduct]
            };
  
            this.cartService.addCart(newCart).subscribe({
              next: () => {
                console.log('New cart created successfully');
                // this.router.navigateByUrl('user/shopping-cart');
              },
              error: (error) => {
                console.error('Error creating cart:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error fetching user cart:', error);
        }
      });
  
    } else {
      this.warningMsg = (product?.sizes && product?.colors)
        ? ((this.viewSize && !this.viewColor) ? "Please select color" : (!this.viewSize && this.viewColor) ? "Please select size" : "Please select size and color")
        : ((!product?.sizes && product?.colors) ? "Please select color" : "Please select size");
      console.log(this.warningMsg);
    }
  }
  

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
