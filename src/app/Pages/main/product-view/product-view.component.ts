import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ViewContentComponent } from '../../../components/product-view/view-content/view-content.component';
import { ViewImagesComponent } from '../../../components/product-view/view-images/view-images.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [BreadcrumbsComponent, ViewContentComponent, ViewImagesComponent],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {
  
  route = inject(ActivatedRoute);
  dataService = inject(DataService);
  paramsSubscription?: Subscription;
  product: any;

  ngOnInit() {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params: any) => {
        const id = params.get('id');
        this.dataService.getJsonData().subscribe(data => {
          this.product = data.products.find((p: any) => p.id == id);
        });
      },
    });
  }

}
