import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ShopSidebarComponent } from '../../../components/shop/shop-sidebar/shop-sidebar.component';
import { ProductCardComponent } from '../../../components/Shared/product-card/product-card.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { ProductCard2Component } from '../../../components/Shared/product-card-2/product-card-2.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [BreadcrumbsComponent, ShopSidebarComponent, ProductCardComponent, CommonModule, ProductCard2Component],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  dataService = inject(DataService);
  
  products: any;
  categories: any;
  brands: any;
  viewCart = true;

  constructor() { }
  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.products = data.products;
      this.categories = data.products.map((d:any) => {
        return d.category;
      });
      console.log(this.categories)
    });
  }

  cardVertically(){
    this.viewCart = true;
  }
  
  cardHorizontally(){
    this.viewCart = false;
  }

}
