import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION, THEME, STEP_STATE, STEP_STATUS, STEP_DIRECTION, STEP_POSITION } from './enums';
import { Type, ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface Language {
    next?: string;
    previous?: string;
}

export interface ToolbarSettings {
    toolbarPosition: TOOLBAR_POSITION;
    toolbarButtonPosition: TOOLBAR_BUTTON_POSITION;
    showNextButton: boolean;
    showPreviousButton: boolean;
    toolbarExtraButtons: ToolbarButton[];
}

export interface ToolbarButton {
    text: string;
    class: string;
    event?: () => void;
}

export interface AnchorSettings {
    anchorClickable?: boolean;
    enableAllAnchors?: boolean;
    markDoneStep?: boolean;
    markAllPreviousStepsAsDone?: boolean;
    removeDoneStepOnNavigateBack?: boolean;
    enableAnchorOnDoneStep?: boolean;
}

export interface NgWizardConfig {
    selected: number;
    keyNavigation: boolean;
    cycleSteps: boolean;
    lang: Language;
    toolbarSettings: ToolbarSettings;
    anchorSettings: AnchorSettings;
    theme: THEME;
}

export type CanEnterExitArgs = boolean | ((args: StepValidationArgs) => boolean | Observable<boolean>);

/** @deprecated Use CanEnterExitArgs instead */
export type CanEnterExistArgs = CanEnterExitArgs;

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type NgWizardOptions = DeepPartial<NgWizardConfig>;

/** Data snapshot of a wizard step, used in event args. */
export interface NgWizardStepData {
    index: number;
    title: string;
    description: string;
    state: STEP_STATE;
    status: STEP_STATUS;
    component?: Type<unknown>;
    componentRef?: ComponentRef<unknown>;
    canEnter?: CanEnterExitArgs;
    canExit?: CanEnterExitArgs;
}

export interface StepValidationArgs {
    direction: STEP_DIRECTION;
    fromStep: NgWizardStepData;
    toStep: NgWizardStepData;
}

export interface StepChangedArgs {
    step: NgWizardStepData;
    previousStep: NgWizardStepData;
    direction: STEP_DIRECTION;
    position: STEP_POSITION;
}
