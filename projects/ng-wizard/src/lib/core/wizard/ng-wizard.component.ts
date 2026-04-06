import {
  Component, AfterContentInit, ChangeDetectionStrategy,
  input, output, contentChildren, signal, computed, inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isObservable, lastValueFrom, Observable, of } from 'rxjs';

import { NgWizardDataService } from '../ng-wizard-data.service';
import {
  NgWizardConfig,
  ToolbarButton,
  StepChangedArgs,
  NgWizardOptions,
  CanEnterExitArgs,
} from '../../utils/interfaces';
import { TOOLBAR_POSITION, STEP_STATE, STEP_STATUS, THEME, STEP_DIRECTION, STEP_POSITION } from '../../utils/enums';
import { merge } from '../../utils/functions';
import { NgWizardStepComponent } from '../wizard-step/ng-wizard-step.component';

@Component({
  selector: 'ng-wizard',
  templateUrl: './ng-wizard.component.html',
  styleUrls: ['./ng-wizard.component.css'],
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgWizardComponent implements AfterContentInit {
  private readonly ngWizardDataService = inject(NgWizardDataService);

  // Signal inputs / outputs
  readonly pConfig = input<NgWizardOptions>({}, { alias: 'config' });
  readonly stepChanged = output<StepChangedArgs>();
  readonly themeChanged = output<THEME>();
  readonly reseted = output<void>();

  // Signal content query
  readonly steps = contentChildren(NgWizardStepComponent, { descendants: true });

  // All mutable state as signals
  readonly config = signal<NgWizardConfig | undefined>(undefined);
  readonly currentStepIndex = signal<number | null>(null);
  readonly currentStep = signal<NgWizardStepComponent | undefined>(undefined);
  readonly isLoading = signal(false);

  // Style signals
  readonly mainClass = computed(() => {
    const cfg = this.config();
    const base = cfg ? 'ng-wizard-main ng-wizard-theme-' + cfg.theme : 'ng-wizard-main';
    return this.isLoading() ? base + ' ng-wizard-loading' : base;
  });

  readonly stepClass = computed(() => {
    const cfg = this.config();
    let cls = 'nav-item';
    if (cfg?.anchorSettings.enableAllAnchors && cfg?.anchorSettings.anchorClickable) {
      cls += ' clickable';
    }
    return cls;
  });

  readonly toolbarTopClass = computed(() => {
    const cfg = this.config();
    return cfg ? 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-top justify-content-' + cfg.toolbarSettings.toolbarButtonPosition : '';
  });

  readonly toolbarBottomClass = computed(() => {
    const cfg = this.config();
    return cfg ? 'btn-toolbar ng-wizard-toolbar ng-wizard-toolbar-bottom justify-content-' + cfg.toolbarSettings.toolbarButtonPosition : '';
  });

  readonly previousButtonClass = computed(() => {
    const base = 'btn btn-secondary ng-wizard-btn-prev';
    const cfg = this.config();
    if (!cfg?.cycleSteps) {
      const idx = this.currentStepIndex();
      if (idx === null || idx <= 0) return base + ' disabled';
    }
    return base;
  });

  readonly nextButtonClass = computed(() => {
    const base = 'btn btn-secondary ng-wizard-btn-next';
    const cfg = this.config();
    if (!cfg?.cycleSteps) {
      const idx = this.currentStepIndex();
      if (idx === null || idx >= this.steps().length - 1) return base + ' disabled';
    }
    return base;
  });

  readonly showToolbarTop = computed(() => {
    const pos = this.config()?.toolbarSettings.toolbarPosition;
    return pos === TOOLBAR_POSITION.top || pos === TOOLBAR_POSITION.both;
  });

  readonly showToolbarBottom = computed(() => {
    const pos = this.config()?.toolbarSettings.toolbarPosition;
    return pos === TOOLBAR_POSITION.bottom || pos === TOOLBAR_POSITION.both;
  });

  readonly showPreviousButton = computed(() => this.config()?.toolbarSettings.showPreviousButton ?? false);
  readonly showNextButton = computed(() => this.config()?.toolbarSettings.showNextButton ?? false);
  readonly showExtraButtons = computed(() => {
    const buttons = this.config()?.toolbarSettings.toolbarExtraButtons;
    return !!buttons && buttons.length > 0;
  });

  constructor() {
    this.ngWizardDataService.resetWizard$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this._reset());

    this.ngWizardDataService.showNextStep$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this._showNextStep());

    this.ngWizardDataService.showPreviousStep$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this._showPreviousStep());

    this.ngWizardDataService.showStep$
      .pipe(takeUntilDestroyed())
      .subscribe(index => this._showStep(index));

    this.ngWizardDataService.setTheme$
      .pipe(takeUntilDestroyed())
      .subscribe(theme => this._setTheme(theme));
  }

  ngAfterContentInit() {
    this._backupStepStates();
    this._init();
  }

  _init() {
    const defaultConfig = this.ngWizardDataService.getDefaultConfig();
    this.config.set(merge(defaultConfig, this.pConfig()));

    this._initSteps();
    this._showStep(this.config()!.selected);
  }

  _initSteps() {
    const cfg = this.config()!;
    const stepsArr = this.steps();
    stepsArr.forEach((step, index) => {
      step.index.set(index);
      if (step.state() === undefined) {
        step.state.set(step.inputState() || STEP_STATE.normal);
      }
    });

    if (cfg.selected > 0 && cfg.anchorSettings.markDoneStep && cfg.anchorSettings.markAllPreviousStepsAsDone) {
      stepsArr.forEach(step => {
        if (step.state() != STEP_STATE.disabled && step.state() != STEP_STATE.hidden) {
          if (step.index() < cfg.selected) {
            step.status.set(STEP_STATUS.done);
          }
        }
      });
    }
  }

  _backupStepStates() {
    this.steps().forEach(step => {
      step.initialStatus.set(step.status());
      step.initialState.set(step.state());
    });
  }

  _restoreStepStates() {
    this.steps().forEach(step => {
      step.status.set(step.initialStatus());
      step.state.set(step.initialState());
    });
  }

  _getStepCssClass(selectedStep: NgWizardStepComponent) {
    let cls = this.stepClass();

    switch (selectedStep.state()) {
      case STEP_STATE.disabled: cls += ' disabled'; break;
      case STEP_STATE.error: cls += ' danger'; break;
      case STEP_STATE.hidden: cls += ' hidden'; break;
    }

    switch (selectedStep.status()) {
      case STEP_STATUS.done: cls += ' done'; break;
      case STEP_STATUS.active: cls += ' active'; break;
    }

    return cls;
  }

  _showSelectedStep(event: Event, selectedStep: NgWizardStepComponent) {
    event.preventDefault();
    const cfg = this.config()!;

    if (!cfg.anchorSettings.anchorClickable) return;
    if (!cfg.anchorSettings.enableAnchorOnDoneStep && selectedStep.status() == STEP_STATUS.done) return;

    if (selectedStep.index() != this.currentStepIndex()) {
      if (cfg.anchorSettings.enableAllAnchors && cfg.anchorSettings.anchorClickable) {
        this._showStep(selectedStep.index());
      } else if (selectedStep.status() == STEP_STATUS.done) {
        this._showStep(selectedStep.index());
      }
    }
  }

  _showNextStep(event?: Event) {
    if (event) event.preventDefault();

    const stepsArr = this.steps();
    const filteredSteps = stepsArr.filter(step =>
      step.index() > (this.currentStepIndex() ?? -1)
      && step.state() != STEP_STATE.disabled
      && step.state() != STEP_STATE.hidden
    );

    if (filteredSteps.length == 0) {
      if (!this.config()!.cycleSteps) return;
      this._showStep(0);
    } else {
      this._showStep(filteredSteps[0].index());
    }
  }

  _showPreviousStep(event?: Event) {
    if (event) event.preventDefault();

    const stepsArr = this.steps();
    const cfg = this.config()!;
    const upperBound = (this.currentStepIndex() === null && cfg.cycleSteps ? stepsArr.length : this.currentStepIndex()) ?? 0;

    const filteredSteps = stepsArr.filter(step =>
      step.index() < upperBound
      && step.state() != STEP_STATE.disabled
      && step.state() != STEP_STATE.hidden
    );

    if (filteredSteps.length == 0) {
      if (!cfg.cycleSteps) return;
      this._showStep(stepsArr.length - 1);
    } else {
      this._showStep(filteredSteps[filteredSteps.length - 1].index());
    }
  }

  _showStep(selectedStepIndex: number) {
    const stepsArr = this.steps();

    if (selectedStepIndex >= stepsArr.length || selectedStepIndex < 0) return;
    if (selectedStepIndex == this.currentStepIndex()) return;

    const selectedStep = stepsArr[selectedStepIndex];
    if (selectedStep.state() == STEP_STATE.disabled || selectedStep.state() == STEP_STATE.hidden) return;

    this.isLoading.set(true);

    return lastValueFrom(this._isStepChangeValid(selectedStep, this.currentStep()?.canExit()))
      .then(isValid => {
        if (isValid) {
          return lastValueFrom(this._isStepChangeValid(selectedStep, selectedStep.canEnter()));
        }
        return lastValueFrom(of(isValid));
      })
      .then(isValid => {
        if (isValid) {
          this._loadStepContent(selectedStep);
        }
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  private _isStepChangeValid(selectedStep: NgWizardStepComponent, condition?: CanEnterExitArgs): Observable<boolean> {
    if (typeof condition === 'boolean') return of(condition);

    if (typeof condition === 'function') {
      const curStep = this.currentStep();
      const direction = this._getStepDirection(selectedStep.index());
      if (!direction || !curStep) return of(true);

      const result = condition({ direction, fromStep: curStep.toStepData(), toStep: selectedStep.toStepData() });

      if (isObservable(result)) return result as Observable<boolean>;
      if (typeof result === 'boolean') return of(result);
      return of(false);
    }

    return of(true);
  }

  _loadStepContent(selectedStep: NgWizardStepComponent) {
    this._setAnchor(selectedStep);

    const args: StepChangedArgs = {
      step: selectedStep.toStepData(),
      previousStep: this.currentStep()?.toStepData() ?? selectedStep.toStepData(),
      direction: this._getStepDirection(selectedStep.index()) ?? STEP_DIRECTION.forward,
      position: this._getStepPosition(selectedStep.index()),
    };
    this.stepChanged.emit(args);
    this.ngWizardDataService.stepChanged(args);

    this.currentStepIndex.set(selectedStep.index());
    this.currentStep.set(selectedStep);
  }

  _setAnchor(selectedStep: NgWizardStepComponent) {
    const curStep = this.currentStep();
    if (curStep) {
      curStep.status.set(STEP_STATUS.untouched);

      if (this.config()!.anchorSettings.markDoneStep) {
        curStep.status.set(STEP_STATUS.done);

        if (this.config()!.anchorSettings.removeDoneStepOnNavigateBack) {
          this.steps().forEach(step => {
            if (step.index() > selectedStep.index()) {
              step.status.set(STEP_STATUS.untouched);
            }
          });
        }
      }
    }

    selectedStep.status.set(STEP_STATUS.active);
  }

  _extraButtonClicked(button: ToolbarButton) {
    if (button.event) button.event();
  }

  private _getStepDirection(selectedStepIndex: number): STEP_DIRECTION | null {
    const idx = this.currentStepIndex();
    return (idx != null && idx != selectedStepIndex)
      ? (idx < selectedStepIndex ? STEP_DIRECTION.forward : STEP_DIRECTION.backward)
      : null;
  }

  private _getStepPosition(selectedStepIndex: number): STEP_POSITION {
    return selectedStepIndex == 0
      ? STEP_POSITION.first
      : (selectedStepIndex == this.steps().length - 1 ? STEP_POSITION.final : STEP_POSITION.middle);
  }

  _setTheme(theme: THEME) {
    const cfg = this.config();
    if (!cfg || cfg.theme == theme) return;

    this.config.set({ ...cfg, theme });
    this.themeChanged.emit(theme);
  }

  _reset() {
    this.currentStepIndex.set(null);
    this.currentStep.set(undefined);
    this._restoreStepStates();
    this._init();
    this.reseted.emit();
  }
}
