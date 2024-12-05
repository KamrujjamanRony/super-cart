import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ViewContentComponent } from '../../../components/product-view/view-content/view-content.component';
import { ViewImagesComponent } from '../../../components/product-view/view-images/view-images.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
    selector: 'app-product-view',
    imports: [BreadcrumbsComponent, ViewContentComponent, ViewImagesComponent],
    templateUrl: './product-view.component.html',
    styleUrl: './product-view.component.css'
})
export class ProductViewComponent {
  
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  paramsSubscription?: Subscription;
  product: any;

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params: any) => {
        const id = params.get('id');
        this.productService.getProduct(id).subscribe(data => {
          this.product = data;
        });
      },
    });
  }

}
