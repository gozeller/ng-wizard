import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { NgWizardComponent } from './ng-wizard.component';

describe('NgWizardComponent', () => {
  let component: NgWizardComponent;
  let fixture: ComponentFixture<NgWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgWizardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
