import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FieldComponent } from '../../../components/admin/field/field.component';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-form',
  imports: [CommonModule, FieldComponent, ReactiveFormsModule],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent {
  @Input() selectedUser: any = null;
  @Input() modalTitle: string = 'User Form';

  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() formReset = new EventEmitter<void>();

  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: [''],
    eId: [null],
    isActive: [true],
    menuPermissions: [['']],
  });

  ngOnChanges() {
    if (this.selectedUser) {
      this.form.patchValue({
        userName: this.selectedUser?.userName,
        password: this.selectedUser?.password,
        eId: this.selectedUser?.eId,
        isActive: this.selectedUser?.isActive,
        menuPermissions: this.selectedUser?.menuPermissions,
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
      userName: '',
      password: '',
      eId: null,
      isActive: true,
      menuPermissions: [''],
    });
    this.isSubmitted = false;
    this.formReset.emit();
  }

}
