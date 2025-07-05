import { RouterLink } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-categories',
    imports: [RouterLink],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.css'
})
export class CategoriesComponent {
    private DataService = inject(DataService);
    categories: any[] = [];
    ngOnInit() {
        this.DataService.getCategories().subscribe(data => {
            this.categories = data;
        });
    }

}
