import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ProductCardComponent } from '../../../components/Shared/product-card/product-card.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { ProductCard2Component } from '../../../components/Shared/product-card-2/product-card-2.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [BreadcrumbsComponent, ProductCardComponent, CommonModule, ProductCard2Component],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  dataService = inject(DataService);
  
  products: any;
  categories: any;
  brands: any;
  brandNames: string[] = [];
  categoryNames: string[] = [];
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
      this.sizes = this.groupProductsByArrayProperty(this.products, 'sizes');
      this.colors = this.groupProductsByArrayProperty(this.products, 'colors');
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

  groupProductsByArrayProperty(products: any[], property: string): any[] {
    const propertyMap = products.reduce((acc, product) => {
      const props = product[property];
      if (Array.isArray(props)) {
        props.forEach(prop => {
          if (!acc[prop]) {
            acc[prop] = 0;
          }
          acc[prop]++;
        });
      }
      return acc;
    }, {});

    return Object.keys(propertyMap).map(prop => ({
      title: prop,
      quantity: propertyMap[prop]
    }));
  }

  toggleCategoryName(category: string, event: any): void {
    if (event.target.checked) {
      this.categoryNames.push(category);
    } else {
      const index = this.categoryNames.indexOf(category);
      if (index > -1) {
        this.categoryNames.splice(index, 1);
      }
    }
  }

  toggleBrandName(brand: string, event: any): void {
    if (event.target.checked) {
      this.brandNames.push(brand);
    } else {
      const index = this.brandNames.indexOf(brand);
      if (index > -1) {
        this.brandNames.splice(index, 1);
      }
    }
  }

  byCategory(data: any): any {
    if (!this.categoryNames || this.categoryNames.length === 0) {
      return data; // If the categoryNames array is empty, return all data
    }
  
    const selectedData = data.filter((product: any) => product && this.categoryNames.includes(product.category.toString()));
    return selectedData;
  }


  byBrand(data: any): any {
    if (!this.brandNames || this.brandNames.length === 0) {
      return data; // If the brandNames array is empty, return all data
    }
  
    const selectedData = data.filter((product: any) => product && this.brandNames.includes(product.brand.toString()));
    return selectedData;
  }

}
