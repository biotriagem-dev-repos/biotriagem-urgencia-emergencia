import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideHttpClient, withFetch } from '@angular/common/http'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import {
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore'
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { environment } from '../environments/environment'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() =>
      initializeApp(environment.firebaseConfig)
    ),
    provideFirestore(() => getFirestore()),
  ],
}
