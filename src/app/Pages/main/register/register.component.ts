
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { AuthService } from '../../../services/user/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
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
  authCookieService = inject(AuthCookieService);
  router = inject(Router);

  error: any;


  onSubmit(e: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      // console.log(this.form.value);
      const { email, password } = this.form.value;
      this.authService.registerWithEmail(email, password)
        .then((data) => {
          this.authCookieService.login(data.user);
          console.log('User registered successfully');
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.error = err.toString();
          console.log('Register failed', err.toString());
        });
    } else {
      alert('Form is invalid! Please Fill Email and Password.');
    }
  }

  loginWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then((data) => {
        this.authCookieService.login(data.user);
        console.log('Logged in with Google')
      })
      .catch((err) => {
        this.error = err.toString();
        console.error('Google login failed', err)
      });
  }

  loginWithFacebook() {
    this.authService
      .signInWithFacebook()
      .then((data) => {
        this.authCookieService.login(data.user);
        console.log('Logged in with Facebook')
      })
      .catch((err) => {
        this.error = err.toString();
        console.error('Facebook login failed', err)
      });
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
