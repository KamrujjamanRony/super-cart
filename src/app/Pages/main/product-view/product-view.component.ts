import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../../components/Shared/breadcrumbs/breadcrumbs.component';
import { ViewContentComponent } from '../../../components/product-view/view-content/view-content.component';
import { ViewImagesComponent } from '../../../components/product-view/view-images/view-images.component';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [BreadcrumbsComponent, ViewContentComponent, ViewImagesComponent],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {

}
