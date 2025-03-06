import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/auth-cookie.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
  usersService = inject(UsersService);
  authService = inject(AuthService);
  authCookieService = inject(AuthCookieService);
  router = inject(Router);

  error: any;


  onSubmit(e: Event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      // console.log(this.form.value);
      const { email, password } = this.form.value;
      this.authService
        .signInWithEmail(email, password)
        .then((data) => {
          this.authCookieService.login(data.user);
          this.entryUser(data.user);
          console.log('Logged in successfully');
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.error = err.toString();
          console.log('Login failed', err.toString());
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
        this.entryUser(data.user);
        console.log('Logged in with Google');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.error = err.toString();
        console.log('Google login failed', err)
      });
  }

  loginWithFacebook() {
    this.authService
      .signInWithFacebook()
      .then((data) => {
        this.authCookieService.login(data.user);
        this.entryUser(data.user);
        console.log('Logged in with Facebook');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.error = err.toString();
        console.log('Facebook login failed', err)
      });
  }

  resetPassword(e: Event) {
    e.preventDefault();
    const emailControl = this.form.get('email');
    if (emailControl && emailControl.value) {
      this.authService.forgotPassword(emailControl.value)
        .then(() => console.log('Password reset email sent'))
        .catch((err) => {
          this.error = err.toString();
          console.log('Password reset email failed', err)
        });
    } else {
      alert('Email is required for password reset');
    }
  }

  entryUser(data: any) {
    const userInfo = {
      userId: data?.uid,
      email: data?.providerData[0]?.email,
      username: data?.providerData[0]?.email,
      role: "user",
      fullname: data?.providerData[0]?.displayName,
      photoURL: data?.providerData[0]?.photoURL,
      address: [],
      gender: "",
      dob: "",
      phoneNumber: data?.providerData[0]?.phoneNumber
    }
    console.log(data.providerData[0])
    setTimeout(() => {
      this.usersService.addUser(userInfo).subscribe(data => {
        console.log(data)
      });
    }, 500)
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
