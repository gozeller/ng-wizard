import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgWizardOptions } from '../utils/interfaces';
import { NG_WIZARD_CONFIG_TOKEN } from './ng-wizard-config.token';

/**
 * Provides the ng-wizard configuration.
 *
 * Use this in your application providers instead of NgWizardModule.forRoot().
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNgWizard({ theme: THEME.arrows }),
 *   ]
 * });
 */
export function provideNgWizard(options: NgWizardOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_WIZARD_CONFIG_TOKEN, useValue: options },
  ]);
}
