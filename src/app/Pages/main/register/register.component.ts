import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Form Init ------------------------------------------------------
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  
  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
  // End Form Init ----------------------------------------------------------------

  // Declare Services ------------------------------------------------------
  authService = inject(AuthService);
  router = inject(Router);

  error: any;
  

  onSubmit(e: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      // console.log(this.form.value);
      const { email, password } = this.form.value;
      this.authService.login(email, password).subscribe({
        next: user => {
          console.log('Login successful', user);
          this.router.navigate(['/']);
        },
        error: err => {
          this.error = err.message;
        }
      });
    } else {
      alert('Form is invalid! Please Fill Email and Password.');
    }
  }

  formReset(e: Event): void {
    e.preventDefault();
    this.form.reset({
      email: '',
      password: ''
    });
    this.isSubmitted = false;
  }
}
