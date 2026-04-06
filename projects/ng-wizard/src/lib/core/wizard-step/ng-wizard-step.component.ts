import { Component, OnInit, ChangeDetectionStrategy, input, signal, computed, viewChild, Type, ComponentRef } from '@angular/core';
import { STEP_STATE, STEP_STATUS } from '../../utils/enums';
import { CanEnterExitArgs, NgWizardStepData } from '../../utils/interfaces';
import { NgWizardStepContentDirective } from '../ng-wizard-step-content.directive';

@Component({
  selector: 'ng-wizard-step[title]',
  templateUrl: './ng-wizard-step.component.html',
  styleUrls: ['./ng-wizard-step.component.css'],
  imports: [NgWizardStepContentDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[hidden]': 'hidden()',
  },
})
export class NgWizardStepComponent implements OnInit {
  // Signal inputs (from parent template)
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly inputState = input<STEP_STATE | undefined>(undefined, { alias: 'state' });
  readonly component = input<Type<unknown> | undefined>(undefined);
  readonly canEnter = input<CanEnterExitArgs | undefined>(undefined);
  readonly canExit = input<CanEnterExitArgs | undefined>(undefined);

  // Mutable state (managed by wizard parent)
  readonly index = signal(-1);
  readonly state = signal<STEP_STATE | undefined>(undefined);
  readonly initialState = signal<STEP_STATE | undefined>(undefined);
  readonly status = signal<STEP_STATUS>(STEP_STATUS.untouched);
  readonly initialStatus = signal<STEP_STATUS>(STEP_STATUS.untouched);
  readonly componentRef = signal<ComponentRef<unknown> | undefined>(undefined);

  readonly stepContent = viewChild.required(NgWizardStepContentDirective);

  readonly hidden = computed(() => this.status() !== STEP_STATUS.active);
  readonly isHidden = computed(() => this.state() === STEP_STATE.hidden);

  ngOnInit() {
    // Sync the input state to the mutable signal on init
    if (this.state() === undefined) {
      this.state.set(this.inputState());
    }
    this.loadComponent();
  }

  loadComponent() {
    const comp = this.component();
    if (!comp) {
      return;
    }

    const content = this.stepContent();
    content.viewContainerRef.clear();
    this.componentRef.set(content.viewContainerRef.createComponent(comp));
  }

  /** Snapshot for event args */
  toStepData(): NgWizardStepData {
    return {
      index: this.index(),
      title: this.title(),
      description: this.description(),
      state: this.state() ?? STEP_STATE.normal,
      status: this.status(),
      component: this.component(),
      componentRef: this.componentRef(),
      canEnter: this.canEnter(),
      canExit: this.canExit(),
    };
  }
}
