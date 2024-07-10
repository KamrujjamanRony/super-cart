import { Component } from '@angular/core';
import { AddSectionComponent } from '../../../components/Home/add-section/add-section.component';
import { CarouselComponent } from '../../../components/Home/carousel/carousel.component';
import { CategoriesComponent } from '../../../components/Home/categories/categories.component';
import { FeatureProductComponent } from '../../../components/Home/feature-product/feature-product.component';
import { ProductWrapperComponent } from '../../../components/Home/product-wrapper/product-wrapper.component';
import { RecommendSectionComponent } from '../../../components/Home/recommend-section/recommend-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AddSectionComponent, CarouselComponent, CategoriesComponent, FeatureProductComponent, ProductWrapperComponent, RecommendSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
