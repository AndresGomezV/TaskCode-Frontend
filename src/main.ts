import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { mergeApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';

bootstrapApplication(AppComponent,
  mergeApplicationConfig(appConfig, {
    providers: [
      provideHttpClient(),
      provideAnimations(),
      BsModalService
    ]
  })
)
  .catch(err => console.error(err));
