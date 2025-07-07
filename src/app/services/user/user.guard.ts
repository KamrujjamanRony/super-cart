import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthCookieService } from './auth-cookie.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {
  constructor(
    private location: Location,
    private authService: AuthCookieService
  ) { }

  canActivate(): boolean {
    const userInfo = this.authService.getUserData();

    if (userInfo) {
      return true;
    }

    this.location.back();
    return false;
  }
}