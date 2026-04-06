import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { DemoWizardService } from './demo-wizard.service';

describe('DemoWizardService', () => {
  let service: DemoWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        DemoWizardService,
      ],
    });
    service = TestBed.inject(DemoWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
