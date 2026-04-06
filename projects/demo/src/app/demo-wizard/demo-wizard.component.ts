import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DemoWizardService, StepDefinition } from './services/demo-wizard.service';
import {
  NgWizardOptions,
  NgWizardService,
  NgWizardComponent,
  NgWizardStepComponent,
  STEP_STATE,
  StepChangedArgs,
  THEME
} from "ng-wizard";
import { StepSixComponent } from './steps/step-6/step-six.component';

@Component({
  selector: 'app-demo-wizard',
  imports: [FormsModule, NgWizardComponent, NgWizardStepComponent, StepSixComponent],
  templateUrl: './demo-wizard.component.html',
  styleUrls: ['./demo-wizard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoWizardComponent implements OnInit {
  private readonly ngWizardService = inject(NgWizardService);
  private readonly demoWizardService = inject(DemoWizardService);

  config: NgWizardOptions;
  stepDefinitions: StepDefinition[];

  stepStates = { normal: STEP_STATE.normal, disabled: STEP_STATE.disabled, error: STEP_STATE.error, hidden: STEP_STATE.hidden };
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];
  stepIndexes = [0, 1, 2, 3, 4, 5, 6];

  selectedTheme?: THEME;
  selectedStepIndex?: number;

  constructor() {
    this.config = this.demoWizardService.config;
    this.stepDefinitions = this.demoWizardService.stepDefinitions;

    this.config.toolbarSettings?.toolbarExtraButtons?.push(
      {
        text: 'Reset',
        class: 'btn btn-danger',
        event: this.resetWizard.bind(this)
      }
    );
  }

  ngOnInit() {
    this.selectedTheme = this.config.theme;
    this.selectedStepIndex = this.config.selected;

    this.ngWizardService.stepChanged()
      .subscribe({
        next: () => {
          console.log('catching step change - method 2');
        }
      });
  }

  stepChanged(args: StepChangedArgs) {
    this.selectedStepIndex = args.step.index;
    console.log('catching step change - method 1');
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.selectedTheme = this.config.theme;
    this.selectedStepIndex = this.config.selected;
    this.ngWizardService.reset();
  }

  themeSelected() {
    if (this.selectedTheme) {
      this.ngWizardService.theme(this.selectedTheme);
    }
  }

  stepIndexSelected() {
    if (this.selectedStepIndex !== undefined && this.selectedStepIndex >= 0) {
      this.ngWizardService.show(this.selectedStepIndex);
    }
  }
}
