import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLJ20acpkZ2NJnnggMac1ksJwnu6U5tkY",
  authDomain: "bistro-boss-15cc7.firebaseapp.com",
  projectId: "bistro-boss-15cc7",
  storageBucket: "bistro-boss-15cc7.firebasestorage.app",
  messagingSenderId: "320128756396",
  appId: "1:320128756396:web:8caf8561f015ac26a10d09"
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideHttpClient(withFetch()), provideAnimations(), importProvidersFrom([provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth())])]
};
