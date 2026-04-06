import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngWizardStepContent]',
})
export class NgWizardStepContentDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
