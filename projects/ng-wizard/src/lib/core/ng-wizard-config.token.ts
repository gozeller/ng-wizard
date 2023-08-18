import { InjectionToken } from '@angular/core';
import {NgWizardOptions} from '../utils/interfaces';


export const NG_WIZARD_CONFIG_TOKEN = new InjectionToken<NgWizardOptions>('ngWizardCustom.config');
