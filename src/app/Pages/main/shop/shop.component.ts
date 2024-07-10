import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ShopSidebarComponent } from '../../../components/shop/shop-sidebar/shop-sidebar.component';
import { ProductCardComponent } from '../../../components/Shared/product-card/product-card.component';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [BreadcrumbsComponent, ShopSidebarComponent, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  dataService = inject(DataService);
  
  products: any;
  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.products = data.products;
      console.log(this.products)
    });
  }

}
