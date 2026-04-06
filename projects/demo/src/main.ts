import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideNgWizard, THEME } from 'ng-wizard';
import { DemoWizardService } from './app/demo-wizard/services/demo-wizard.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideNgWizard({ theme: THEME.arrows }),
    DemoWizardService,
  ],
}).catch(err => console.error(err));
