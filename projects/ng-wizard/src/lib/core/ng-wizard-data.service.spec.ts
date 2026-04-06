import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { NgWizardDataService } from './ng-wizard-data.service';

describe('NgWizardDataService', () => {
  let service: NgWizardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(NgWizardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
