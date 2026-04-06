import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { StepFourComponent } from './step-four.component';

describe('StepFourComponent', () => {
  let component: StepFourComponent;
  let fixture: ComponentFixture<StepFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFourComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StepFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
