import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthCookieService } from './auth-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthCookieService
  ) { }

  canActivate(): boolean {
    const userInfo = this.authService.getUserData();
    console.log(userInfo);

    if (userInfo) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}