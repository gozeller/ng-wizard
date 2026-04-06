import { Component, ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOneComponent {
  validateEntryToStep() {
    return true;
  }

  validateExitFromStep() {
    return of(true);
  }
}
