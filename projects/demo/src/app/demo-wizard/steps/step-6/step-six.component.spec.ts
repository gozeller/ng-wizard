import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { StepSixComponent } from './step-six.component';

describe('StepSixComponent', () => {
  let component: StepSixComponent;
  let fixture: ComponentFixture<StepSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepSixComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StepSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
