import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumbs',
    imports: [RouterLink],
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent {
  @Input() name: any;
}
