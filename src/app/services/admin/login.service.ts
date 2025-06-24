import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly http = inject(HttpClient);
  baseApiUrl = 'http://supersoft:81/HWS/Authentication';

  login(model: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Login`, model)
  }
}
