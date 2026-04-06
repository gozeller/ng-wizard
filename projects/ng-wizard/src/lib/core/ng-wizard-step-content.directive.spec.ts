import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgWizardStepContentDirective } from './ng-wizard-step-content.directive';

@Component({
  imports: [NgWizardStepContentDirective],
  template: '<ng-template ngWizardStepContent></ng-template>',
})
class TestHostComponent {}

describe('NgWizardStepContentDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
