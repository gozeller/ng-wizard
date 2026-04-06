import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';

import { NgWizardStepComponent } from './ng-wizard-step.component';

@Component({
  imports: [NgWizardStepComponent],
  template: '<ng-wizard-step title="Test Step"><span>Test content</span></ng-wizard-step>',
})
class TestHostComponent {}

describe('NgWizardStepComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
