import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './app/shared/guards-inteceptor/http.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideSpinnerConfig } from 'ngx-spinner';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from './app/date-formats';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptor]),),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      onActivateTick: false,
    }),

    provideSpinnerConfig(
      { type: 'ball-clip-rotate-pulse' }
    ),
    
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }


  ]
}).catch(err => {
  console.error(' Bootstrap error:', err);
});
