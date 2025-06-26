import { Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/admin/auth.service';
import { LoginService } from '../../../services/admin/login.service';
import { ToastService } from '../../../components/primeng/toast/toast.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private LoginService = inject(LoginService);
  private toastService = inject(ToastService);
  private loginSubscription?: Subscription;
  private router = inject(Router);
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;
  loading = signal<boolean>(false);

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', Validators.required],
  });

  // Simplified method to get form controls
  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.loading.set(true);
      this.loginSubscription = this.LoginService.login(this.form.value)
        .subscribe({
          next: (response: any) => {
            this.authService.setUser(response);
            this.toastService.showMessage('success', 'Successful', 'User Login Successfully!');
            this.loading.set(false);
            this.form.reset();
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            console.error('Error login user:', error);
            if (error.error.message || error.error.title) {
              this.toastService.showMessage('error', 'Error', `${error.error.status} : ${error.error.message || error.error.title}`);
            }
          }
        });
      this.isSubmitted = true;
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
    }
  };

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
