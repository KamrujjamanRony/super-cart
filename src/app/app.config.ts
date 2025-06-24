import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './services/admin/auth.interceptor';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFJCGAbWU3TJmmo1BJBSnnlwUin68wYvo",
  authDomain: "super-cart-80b68.firebaseapp.com",
  projectId: "super-cart-80b68",
  storageBucket: "super-cart-80b68.firebasestorage.app",
  messagingSenderId: "193969857306",
  appId: "1:193969857306:web:931f5f4d45f918140002a3"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    CookieService,
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};

