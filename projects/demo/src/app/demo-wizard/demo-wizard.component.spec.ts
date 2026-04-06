import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { DemoWizardComponent } from './demo-wizard.component';
import { DemoWizardService } from './services/demo-wizard.service';
import { provideNgWizard, THEME } from 'ng-wizard';

describe('DemoWizardComponent', () => {
  let component: DemoWizardComponent;
  let fixture: ComponentFixture<DemoWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoWizardComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideNgWizard({ theme: THEME.arrows }),
        DemoWizardService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
