import { Injectable, inject, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { DEFAULT_CONFIG } from '../utils/constants';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';
import { NgWizardConfig, StepChangedArgs } from '../utils/interfaces';
import { THEME } from '../utils/enums';
import { merge } from '../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class NgWizardDataService {
  private readonly config = inject(NG_WIZARD_CONFIG_TOKEN, { optional: true });

  // Command streams (fire-and-forget)
  private readonly _resetWizard = new Subject<void>();
  private readonly _showNextStep = new Subject<void>();
  private readonly _showPreviousStep = new Subject<void>();
  private readonly _showStep = new Subject<number>();
  private readonly _setTheme = new Subject<THEME>();

  readonly resetWizard$: Observable<void> = this._resetWizard.asObservable();
  readonly showNextStep$: Observable<void> = this._showNextStep.asObservable();
  readonly showPreviousStep$: Observable<void> = this._showPreviousStep.asObservable();
  readonly showStep$: Observable<number> = this._showStep.asObservable();
  readonly setTheme$: Observable<THEME> = this._setTheme.asObservable();

  // Step changed state as a signal
  readonly stepChangedArgs = signal<StepChangedArgs | null>(null);

  // Keep observable for backward compat
  private readonly _stepChangedArgs = new Subject<StepChangedArgs>();
  readonly stepChangedArgs$: Observable<StepChangedArgs> = this._stepChangedArgs.asObservable();

  private readonly _defaultConfig: NgWizardConfig;

  constructor() {
    this._defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this._defaultConfig = merge(this._defaultConfig, this.config);
    }
  }

  getDefaultConfig(): NgWizardConfig {
    return { ...this._defaultConfig };
  }

  resetWizard() {
    this._resetWizard.next();
  }

  showNextStep() {
    this._showNextStep.next();
  }

  showPreviousStep() {
    this._showPreviousStep.next();
  }

  showStep(index: number) {
    this._showStep.next(index);
  }

  setTheme(theme: THEME) {
    this._setTheme.next(theme);
  }

  stepChanged(args: StepChangedArgs) {
    this.stepChangedArgs.set(args);
    this._stepChangedArgs.next(args);
  }
}
