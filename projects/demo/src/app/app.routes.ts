import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'demo-wizard' },
  {
    path: 'demo-wizard',
    loadComponent: () => import('./demo-wizard/demo-wizard.component').then(m => m.DemoWizardComponent),
  },
];
