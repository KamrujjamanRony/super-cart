import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, Renderer2 } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ModalComponent } from "../../Shared/modal/modal.component";

@Component({
    selector: 'app-view-images',
    imports: [CommonModule, ModalComponent],
    templateUrl: './view-images.component.html',
    styleUrl: './view-images.component.css'
})
export class ViewImagesComponent {
  cartService = inject(CartService);
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
    // Add product to the cart here
    if ((!product?.sizes && !product?.colors) || (product?.sizes && this.viewSize && !product?.colors) || (product?.colors && this.viewColor && !product?.sizes) || (product?.sizes && this.viewSize && product?.colors && this.viewColor)) {
      const cartProduct = { id: product.id, name: product?.name, image: product?.image, brand: product?.brand, availability: product?.availability, category: product?.category, price: product?.offer_price, purchasedQuantity: product?.purchased_quantity, selectSize: this.viewSize, selectColor: this.viewColor, orderQuantity: this.count };
      this.cartService.addCart(cartProduct).subscribe({
        next: (response) => {
          this.router.navigateByUrl('user/shopping-cart');
        },
        error: (error) => {
          console.error('Error adding product to cart:', error);
        }
      });
    } else {
      this.warningMsg = (product?.sizes && product?.colors)
        ?
        ((this.viewSize && !this.viewColor) ? "Please select color" : (!this.viewSize && this.viewColor) ? "Please select size" : "Please select size and color")
        :
        ((!product?.sizes && product?.colors) ? "Please select color" : "Please select size");
      console.log(this.warningMsg);
    }

  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}
