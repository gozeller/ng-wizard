# ng-wizard

> **Fork of [abdulkadirgenc/ng-wizard](https://github.com/abdulkadirgenc/ng-wizard)**, modernized for Angular 21.

An Angular wizard / stepper component built on Bootstrap 5.

## What's different from the original?

This fork has been fully rewritten for modern Angular while keeping the same look, feel, and feature set:

- **Angular 21** (originally Angular 8)
- **Standalone components** — no NgModules
- **Signal-based** — `input()`, `output()`, `contentChildren()`, `signal()`, `computed()`
- **Zoneless** — no zone.js, uses `provideZonelessChangeDetection()`
- **OnPush** change detection on every component
- **Modern template syntax** — `@if`, `@for` (no `*ngIf` / `*ngFor`)
- **Bootstrap 5.3** (originally Bootstrap 4)

See the [Changelog](#changelog) below for the full history.

## Installation

```bash
npm install ng-wizard
```

## Setup

### 1. Provide the wizard configuration

In your application bootstrap (e.g. `main.ts`):

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNgWizard, THEME } from 'ng-wizard';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideNgWizard({ theme: THEME.arrows }),
  ],
});
```

### 2. Import CSS

Include Bootstrap and the wizard theme CSS files in your global styles (e.g. `styles.css`):

```css
@import 'bootstrap/dist/css/bootstrap.css';

/* Required */
@import 'ng-wizard/themes/ng_wizard.css';

/* Optional — include only the themes you use */
@import 'ng-wizard/themes/ng_wizard_theme_arrows.css';
@import 'ng-wizard/themes/ng_wizard_theme_circles.css';
@import 'ng-wizard/themes/ng_wizard_theme_dots.css';
```

### 3. Use in your component

```typescript
import { Component } from '@angular/core';
import { NgWizardComponent, NgWizardStepComponent, NgWizardService, STEP_STATE, THEME, StepChangedArgs } from 'ng-wizard';

@Component({
  selector: 'app-my-wizard',
  imports: [NgWizardComponent, NgWizardStepComponent],
  template: `
    <ng-wizard [config]="config" (stepChanged)="onStepChanged($event)">
      <ng-wizard-step [title]="'Step 1'" [description]="'First step'">
        <p>Step 1 content</p>
      </ng-wizard-step>

      <ng-wizard-step [title]="'Step 2'" [description]="'Second step'">
        <p>Step 2 content</p>
      </ng-wizard-step>

      <ng-wizard-step [title]="'Step 3'" [description]="'Third step'" [state]="STEP_STATE.disabled">
        <p>This step is disabled</p>
      </ng-wizard-step>
    </ng-wizard>
  `,
})
export class MyWizardComponent {
  STEP_STATE = STEP_STATE;

  config = {
    theme: THEME.arrows,
  };

  onStepChanged(args: StepChangedArgs) {
    console.log('Step changed:', args.step.title);
  }
}
```

## Programmatic control

Use `NgWizardService` to control the wizard from your code:

```typescript
import { inject } from '@angular/core';
import { NgWizardService } from 'ng-wizard';

// In your component:
private wizardService = inject(NgWizardService);

this.wizardService.next();
this.wizardService.previous();
this.wizardService.show(2);       // go to step index 2
this.wizardService.reset();
this.wizardService.theme(THEME.dots);

// Reactive step tracking via signal:
const lastStep = this.wizardService.stepChangedArgs(); // Signal<StepChangedArgs | null>
```

## Screenshots

![Default](/Screenshots/1_default.png)

![Arrows](/Screenshots/2_arrows.png)

![Circles](/Screenshots/3_circles.png)

![Dots](/Screenshots/4_dots.png)

## Configuration

### `NgWizardStepComponent` inputs

| Name        | Type                       | Default              | Description                              |
| ----------- | -------------------------- | -------------------- | ---------------------------------------- |
| title       | `string` (required)        |                      | Step title                               |
| description | `string`                   | `''`                 | Step description                         |
| state       | `STEP_STATE`               | `STEP_STATE.normal`  | Step state (normal, disabled, error, hidden) |
| component   | `Type<unknown>`            |                      | Dynamic component for step content       |
| canEnter    | `CanEnterExitArgs`         |                      | Validation for entering the step         |
| canExit     | `CanEnterExitArgs`         |                      | Validation for leaving the step          |

`CanEnterExitArgs` can be a `boolean`, a function returning `boolean`, or a function returning `Observable<boolean>`.

### `NgWizardConfig` properties

| Name            | Type              | Default           | Description                             |
| --------------- | ----------------- | ----------------- | --------------------------------------- |
| selected        | `number`          | `0`               | Initially selected step                 |
| keyNavigation   | `boolean`         | `true`            | Enable keyboard navigation (arrow keys) |
| cycleSteps      | `boolean`         | `false`           | Allow cycling through steps             |
| lang            | `Language`        | `{ next: 'Next', previous: 'Previous' }` | Button labels |
| toolbarSettings | `ToolbarSettings` | *(see below)*     | Toolbar configuration                   |
| anchorSettings  | `AnchorSettings`  | *(see below)*     | Step anchor configuration               |
| theme           | `THEME`           | `THEME.default`   | Wizard theme                            |

### Themes

- `THEME.default`
- `THEME.arrows`
- `THEME.circles`
- `THEME.dots`

## Migration from earlier versions

If you're upgrading from the original `ng-wizard` package or from earlier versions of this fork:

1. **Replace `NgWizardModule.forRoot(config)`** with `provideNgWizard(config)` in your providers.
2. **Import components directly** — add `NgWizardComponent` and `NgWizardStepComponent` to your component's `imports` array.
3. **Remove `NgWizardModule`** from all imports — it no longer exists.
4. **`NgWizardStep` abstract class** has been replaced by the `NgWizardStepData` interface.
5. **`CanEnterExistArgs`** has been renamed to `CanEnterExitArgs` (old name still works as a deprecated alias).
6. **`NgWizardService.stepChanged()`** (Observable) is deprecated — use the `stepChangedArgs` signal instead.

## Changelog

### 4.0.0 (2026-04-06)

Modernized fork — full rewrite of internals for Angular 21, no changes to the visual appearance or CSS.

- **Angular 21** — upgraded from Angular 15
- **Standalone components** — removed all NgModules (`NgWizardModule` deleted)
- **`provideNgWizard()`** — new provider function replaces `NgWizardModule.forRoot()`
- **Signal-based API** — all `@Input()`, `@Output()`, `@ViewChild()`, `@ContentChildren()`, `@HostBinding()` replaced with signal equivalents (`input()`, `output()`, `viewChild()`, `contentChildren()`, `host: {}`)
- **Zoneless** — no zone.js dependency, works with `provideZonelessChangeDetection()`
- **OnPush** — `ChangeDetectionStrategy.OnPush` on every component
- **Modern templates** — `@if`/`@for` instead of `*ngIf`/`*ngFor`
- **`inject()` function** — replaces all constructor parameter injection
- **`takeUntilDestroyed()`** — replaces manual subscription cleanup
- **`NgWizardStepData` interface** — replaces `NgWizardStep` abstract directive class
- **`CanEnterExitArgs`** — renamed from `CanEnterExistArgs` (deprecated alias kept)
- **`NgWizardService.stepChangedArgs`** — new signal property for reactive step tracking
- **TypeScript 5.9**, Bootstrap 5.3

### 2.0.10

- Fork of [abdulkadirgenc/ng-wizard](https://github.com/abdulkadirgenc/ng-wizard)
- Upgraded to Angular 15, Bootstrap 5.3

## Credits

This component was originally created by [Abdulkadir Genç](https://github.com/abdulkadirgenc/ng-wizard) by rewriting [jQuery Smart Wizard 4](https://github.com/techlab/SmartWizard) in Angular. CSS themes by [TechLaboratory](http://www.techlaboratory.net/).

## License

[MIT License](https://github.com/gozeller/ng-wizard/blob/master/LICENSE)
