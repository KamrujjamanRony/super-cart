
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { UsersService } from '../../../services/user/users.service';
import { AuthService } from '../../../services/user/auth.service';
import { Location } from '@angular/common';
import { ToastService } from '../../../components/primeng/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private location = inject(Location);
  private authCookieService = inject(AuthCookieService);
  private toastService = inject(ToastService);
  private router = inject(Router);

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
          this.location.back();
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
        this.location.back();
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
        this.location.back();
      })
      .catch((err) => {
        this.error = err.toString();
        console.log('Facebook login failed', err)
      });
  }

  entryUser(data: any) {
    console.log(data)
    this.usersService.getUser(data?.uid).subscribe(data => {
      if (data) {
        console.log(data)
      } else {
        const userInfo = {
          userId: data?.uid,
          email: data?.providerData[0]?.email || '',
          username: data?.providerData[0]?.email || '',
          role: "user",
          fullname: data?.providerData[0]?.displayName || data?.providerData[0]?.email?.split('@')[0] || '',
          photoURL: data?.providerData[0]?.photoURL || '',
          address: [],
          gender: "",
          dob: "1997-12-08",
          phoneNumber: data?.providerData[0]?.phoneNumber || ''
        }
        // console.log(data.providerData[0])
        setTimeout(() => {
          this.usersService.addUser(userInfo).subscribe(data => {
            // console.log(data)
          });
        }, 500)
      }
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
