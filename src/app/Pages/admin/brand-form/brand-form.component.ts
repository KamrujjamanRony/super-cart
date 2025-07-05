import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FieldComponent } from '../../../components/admin/field/field.component';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-brand-form',
  imports: [CommonModule, FieldComponent, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.css'
})
export class BrandFormComponent {
  @Input() selectedBrand: any = null;
  @Input() modalTitle: string = 'Brand Form';

  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() formReset = new EventEmitter<void>();

  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;

  form = this.fb.group({
    name: ['', [Validators.required]]
  });

  ngOnChanges() {
    if (this.selectedBrand) {
      this.form.patchValue({
        name: this.selectedBrand?.name
      });
    }
  }

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onSubmit(event: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onFormReset(event: Event) {
    event.preventDefault();
    this.form.reset({
      name: ''
    });
    this.isSubmitted = false;
    this.formReset.emit();
  }

}
