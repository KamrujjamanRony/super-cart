import { Component, inject } from '@angular/core';
import { BreadcrumbsComponent } from "../../../components/Shared/breadcrumbs/breadcrumbs.component";
import { InputsComponent } from "../../../components/Shared/inputs/inputs.component";
import { DataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-checkout',
    imports: [BreadcrumbsComponent, InputsComponent, FormsModule],
    templateUrl: './user-checkout.component.html',
    styleUrl: './user-checkout.component.css'
})
export class UserCheckoutComponent {
  private dataService = inject(DataService);
  inputValue1 = ""
  model: any;
  region: any;
  city: any;
  area: any;

  constructor() {
    this.model = {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      area: ''
    }
  }

  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.region = data?.region;
    });
  }

  onFormSubmit(){
    console.log(this.model)
  }

  onRegionChanged(){
    this.dataService.getCityByParentId(this.model.region).subscribe(
      data => {
        this.city = data;
        this.model.city = '';
        this.model.area = '';
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  onCityChanged(){
    this.dataService.getAreaByParentId(this.model.city).subscribe(
      data => {
        this.area = data;
        this.model.area = '';
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

}
