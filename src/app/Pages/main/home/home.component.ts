import { Component, inject } from '@angular/core';
import { AddSectionComponent } from '../../../components/Home/add-section/add-section.component';
import { CarouselComponent } from '../../../components/Home/carousel/carousel.component';
import { CategoriesComponent } from '../../../components/Home/categories/categories.component';
import { ProductWrapperComponent } from '../../../components/Home/product-wrapper/product-wrapper.component';
import { RecommendSectionComponent } from '../../../components/Home/recommend-section/recommend-section.component';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FeatureProductComponent } from "../../../components/Home/feature-product/feature-product.component";

@Component({
    selector: 'app-home',
    imports: [AddSectionComponent, CarouselComponent, CategoriesComponent, ProductWrapperComponent, RecommendSectionComponent, CommonModule, FeatureProductComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    public dataService = inject(DataService);

    ngOnInit() {
        this.dataService.loadSections().subscribe();
    }

}
