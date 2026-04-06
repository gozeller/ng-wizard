import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { NgWizardService } from './ng-wizard.service';

describe('NgWizardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(NgWizardService);
    expect(service).toBeTruthy();
  });
});
