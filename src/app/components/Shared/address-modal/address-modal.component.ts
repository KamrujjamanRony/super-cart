import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';

interface Address {
  id: string;
  type: string;
  street: string;
  contact: string;
  isDefault: boolean;
  userId: string;    // Division name
  district: string;  // District name
  city: string;      // Area name
}

interface Location {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-address-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.css']
})
export class AddressModalComponent implements OnInit, OnChanges {
  @Input() address: Address | null = null;
  @Input() isEditMode: boolean = false;
  @Output() submit = new EventEmitter<Address>();
  @Output() close = new EventEmitter<void>();

  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  showModal = true;
  divisions: Location[] = [];
  districts: Location[] = [];
  areas: Location[] = [];
  isLoading = false;

  addressTypes = [
    { label: 'Home', value: 'Home' },
    { label: 'Work', value: 'Work' },
    { label: 'Other', value: 'Other' }
  ];

  formData = {
    id: '',
    division: '',
    district: '',
    area: '',
    street: '',
    contact: '',
    type: 'Home',
    isDefault: false
  };

  ngOnInit() {
    this.loadDivisions().then(() => {
      if (this.address) {
        this.initializeFormWithAddress();
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && this.address && this.divisions.length) {
      await this.initializeFormWithAddress();
    }
  }

  private async initializeFormWithAddress() {
    this.isLoading = true;

    try {
      const division = this.divisions.find(d => d.name === this.address?.userId);
      const district = this.districts.find(d => d.name === this.address?.district);
      const area = this.areas.find(a => a.name === this.address?.city);

      this.formData = {
        id: this.address?.id || '',
        type: this.address?.type || 'Home',
        street: this.address?.street || '',
        contact: this.address?.contact || '',
        isDefault: this.address?.isDefault || false,
        division: division?._id || '',
        district: district?._id || '',
        area: area?._id || ''
      };

      // Manually trigger change detection
      this.cdr.detectChanges();

      if (division) {
        await this.loadDistricts(division._id);
        if (district) {
          await this.loadAreas(district._id);
        }
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadDivisions(): Promise<void> {
    this.isLoading = true;
    try {
      const data = await this.dataService.getJsonData().toPromise();
      this.divisions = data?.region || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading divisions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onDivisionChange(divisionId: string) {
    this.formData.district = '';
    this.formData.area = '';
    this.areas = [];

    if (divisionId) {
      await this.loadDistricts(divisionId);
    } else {
      this.districts = [];
    }
    this.cdr.detectChanges();
  }

  private async loadDistricts(divisionId: string): Promise<void> {
    this.isLoading = true;
    try {
      this.districts = await this.dataService.getCityByParentId(divisionId).toPromise() || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading districts:', error);
      this.districts = [];
    } finally {
      this.isLoading = false;
    }
  }

  async onDistrictChange(districtId: string) {
    this.formData.area = '';
    if (districtId) {
      await this.loadAreas(districtId);
    } else {
      this.areas = [];
    }
    this.cdr.detectChanges();
  }

  private async loadAreas(districtId: string): Promise<void> {
    this.isLoading = true;
    try {
      this.areas = await this.dataService.getAreaByParentId(districtId).toPromise() || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading areas:', error);
      this.areas = [];
    } finally {
      this.isLoading = false;
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      const division = this.divisions.find(d => d._id === this.formData.division);
      const district = this.districts.find(d => d._id === this.formData.district);
      const area = this.areas.find(a => a._id === this.formData.area);

      const submissionData: Address = {
        id: this.formData.id || crypto.randomUUID(),
        type: this.formData.type,
        street: this.formData.street,
        contact: this.formData.contact,
        isDefault: this.formData.isDefault,
        userId: division?.name || '',
        district: district?.name || '',
        city: area?.name || ''
      };

      this.submit.emit(submissionData);
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.formData = {
      id: '',
      division: '',
      district: '',
      area: '',
      street: '',
      contact: '',
      type: 'Home',
      isDefault: false
    };
    this.districts = [];
    this.areas = [];
    this.cdr.detectChanges();
  }

  private validateForm(): boolean {
    const requiredFields = ['division', 'district', 'street', 'contact'];
    const missingFields = requiredFields.filter(field => !this.formData[field as keyof typeof this.formData]);

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\d{10,15}$/.test(this.formData.contact)) {
      alert('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    return true;
  }
}