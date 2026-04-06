import { Injectable, Signal, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NgWizardDataService } from './ng-wizard-data.service';
import { THEME } from '../utils/enums';
import { StepChangedArgs } from '../utils/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NgWizardService {
  private readonly ngWizardDataService = inject(NgWizardDataService);

  /** Signal with latest step change info (null until first step change). */
  readonly stepChangedArgs: Signal<StepChangedArgs | null> = this.ngWizardDataService.stepChangedArgs;

  reset() {
    this.ngWizardDataService.resetWizard();
  }

  next() {
    this.ngWizardDataService.showNextStep();
  }

  previous() {
    this.ngWizardDataService.showPreviousStep();
  }

  show(index: number) {
    this.ngWizardDataService.showStep(index);
  }

  theme(theme: THEME) {
    this.ngWizardDataService.setTheme(theme);
  }

  /** @deprecated Use the stepChangedArgs signal instead. */
  stepChanged(): Observable<StepChangedArgs> {
    return this.ngWizardDataService.stepChangedArgs$;
  }
}
