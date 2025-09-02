import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './services/token';

import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyBGbwAox3uma5PPtPFbJTAwiwP6cJe41js",
  authDomain: "project-2900855426560950076.firebaseapp.com",
  projectId: "project-2900855426560950076",
  storageBucket: "project-2900855426560950076.firebasestorage.app",
  messagingSenderId: "229636233367",
  appId: "1:229636233367:web:64a5f590eb95bc939eb1d2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    )
  ]
};