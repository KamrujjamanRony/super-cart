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
  prices: any;
  sizes: any;
  colors: any;
  viewCart = true;

  constructor() { }
  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.products = data.products;
      this.categories = this.groupProductsByProperty(this.products, 'category');
      this.brands = this.groupProductsByProperty(this.products, 'brand');
      this.prices = this.groupProductsByProperty(this.products, 'offer_price');
      this.sizes = this.groupProductsByProperty(this.products, 'size');
      this.colors = this.groupProductsByProperty(this.products, 'color');
      console.log(this.categories);
      console.log(this.brands);
      console.log(this.prices);
      console.log(this.sizes);
      console.log(this.colors);
    });
  }

  cardVertically(){
    this.viewCart = true;
  }
  
  cardHorizontally(){
    this.viewCart = false;
  }

  groupProductsByProperty(products: any[], property: string): any[] {
    const propertyMap = products.reduce((acc, product) => {
      const prop = product[property];
      if (!acc[prop]) {
        acc[prop] = 0;
      }
      acc[prop]++;
      return acc;
    }, {});

    return Object.keys(propertyMap).map(prop => ({
      title: prop,
      quantity: propertyMap[prop]
    }));
  }

}
