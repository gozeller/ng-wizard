import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import { DemoWizardComponent } from './demo-wizard.component';
import { StepOneComponent } from './steps/step-1/step-one.component';
import { StepTwoComponent } from './steps/step-2/step-two.component';
import { StepThreeComponent } from './steps/step-3/step-three.component';
import { StepFourComponent } from './steps/step-4/step-four.component';
import { StepFiveComponent } from './steps/step-5/step-five.component';
import { StepSixComponent } from './steps/step-6/step-six.component';
import {NgWizardModule, NgWizardOptions, THEME} from "ng-wizard";

// routes
export const ROUTES: Routes = [{ path: '', component: DemoWizardComponent }];

// wizard
const ngWizardOptions: NgWizardOptions = {
  theme: THEME.default
};

@NgModule({
  declarations: [
    DemoWizardComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgWizardModule.forRoot(ngWizardOptions),
    RouterModule.forChild(ROUTES),
  ]
})
export class DemoWizardModule { }
