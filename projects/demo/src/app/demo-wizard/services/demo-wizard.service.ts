import { Injectable, Type } from '@angular/core';
import { isObservable, Observable } from 'rxjs';

import { StepOneComponent } from '../steps/step-1/step-one.component';
import { StepTwoComponent } from '../steps/step-2/step-two.component';
import { StepThreeComponent } from '../steps/step-3/step-three.component';
import { StepFourComponent } from '../steps/step-4/step-four.component';
import { StepFiveComponent } from '../steps/step-5/step-five.component';
import {
  NgWizardOptions,
  STEP_STATE,
  THEME,
  CanEnterExitArgs,
  StepValidationArgs,
} from "ng-wizard";

export interface StepDefinition {
  title: string;
  description: string;
  state?: STEP_STATE;
  component: Type<unknown>;
  canEnter?: CanEnterExitArgs;
  canExit?: CanEnterExitArgs;
}

@Injectable()
export class DemoWizardService {

  config: NgWizardOptions = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => alert('Finished!!!')
        },
      ]
    }
  };

  stepDefinitions: StepDefinition[] = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
      component: StepOneComponent,
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
    },
    {
      title: 'Step 2',
      description: 'Step 2 description',
      state: STEP_STATE.disabled,
      component: StepTwoComponent,
    },
    {
      title: 'Step 3',
      description: 'Step 3 description',
      component: StepThreeComponent,
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
    },
    {
      title: 'Step 4',
      description: 'Step 4 description',
      component: StepFourComponent,
    },
    {
      title: 'Step 5',
      description: 'Step 5 description',
      state: STEP_STATE.hidden,
      component: StepFiveComponent,
    },
  ];

  private validateStep(type: string, args: StepValidationArgs): boolean | Observable<boolean> {
    const step = type === 'entry' ? args.toStep : args.fromStep;
    let stepSpecificValidateMethod: unknown;

    if (step?.componentRef) {
      const instance = (step.componentRef as { instance: Record<string, unknown> }).instance;
      stepSpecificValidateMethod = type === 'entry'
        ? instance['validateEntryToStep']
        : instance['validateExitFromStep'];
    }

    if (stepSpecificValidateMethod) {
      if (typeof stepSpecificValidateMethod === 'boolean') {
        return stepSpecificValidateMethod;
      } else if (typeof stepSpecificValidateMethod === 'function') {
        const result: unknown = stepSpecificValidateMethod();

        if (isObservable(result)) {
          return result as Observable<boolean>;
        } else if (typeof result === 'boolean') {
          return result;
        }
      }
    }

    return true;
  }
}
