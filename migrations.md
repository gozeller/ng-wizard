# Migration Plan: Modernize to Angular 21 Best Practices

## Completed: Angular 21 Upgrade

The project has been upgraded from Angular 15 to Angular 21 with these changes:

- **Dependencies**: All `@angular/*` packages → `^21.0.0`, TypeScript `~5.9.0`, ng-packagr `^21.0.0`
- **angular.json**: Demo app uses `application` builder (replaces `browser`), uses `buildTarget` (replaces `browserTarget`), `browser` entry point (replaces `main`)
- **tsconfig.json**: `moduleResolution: "bundler"` (required for Angular 21 subpath exports), removed `experimentalDecorators` and `useDefineForClassFields`
- **`standalone: false`**: Added to all components/directives since Angular 21 defaults to `standalone: true`
- **`inject()` function**: Replaced `@Optional() @Inject()` constructor parameter decorators (not supported with TC39 decorators)
- **Library peer deps**: Updated to `^21.0.0`

## Completed: Standalone Components

All NgModules have been removed. All components/directives are standalone (Angular 21 default).

**Library:**
- [x] All components/directives are standalone (default), with `imports: [...]` for template dependencies
- [x] Created `provideNgWizard(options): EnvironmentProviders` (replaces `NgWizardModule.forRoot()`)
- [x] Deleted `ng-wizard.module.ts`
- [x] Updated `public-api.ts`: removed `NgWizardModule`, added `provideNgWizard`

**Demo:**
- [x] All components are standalone with `imports: [...]`
- [x] `bootstrapApplication()` with `provideRouter()` and `provideNgWizard()`
- [x] Created `app.routes.ts` with `loadComponent`
- [x] Deleted all NgModule files (`app.module.ts`, `app-routing.module.ts`, `demo-wizard.module.ts`)

## Completed: Signals & Modern Template Syntax

All components have been migrated to Angular signals and modern control flow.

**Library:**
- [x] `@Input()` → `input()` / `input.required()` (NgWizardStepComponent)
- [x] `@Output()` → `output()` (NgWizardComponent)
- [x] `@ViewChild()` → `viewChild.required()` (NgWizardStepComponent)
- [x] `@ContentChildren()` → `contentChildren()` (NgWizardComponent)
- [x] `@HostBinding('hidden')` → `host: { '[hidden]': 'hidden()' }` (NgWizardStepComponent)
- [x] Abstract `NgWizardStep` directive class → plain `NgWizardStepData` interface
- [x] `*ngIf` / `*ngFor` → `@if` / `@for` (both templates)
- [x] Removed `CommonModule` — only `NgClass` imported where needed
- [x] `NgWizardDataService`: stepChangedArgs exposed as `signal()`
- [x] `NgWizardService`: `stepChangedArgs` signal + deprecated `stepChanged()` Observable
- [x] `takeUntilDestroyed()` replaces manual `Subscription` cleanup
- [x] `inject()` replaces all constructor injection

**Demo:**
- [x] `@if` / `@for` in demo template
- [x] `inject()` in DemoWizardComponent
- [x] `CanEnterExitArgs` replaces `CanEnterExistArgs` (deprecated alias kept)
- [x] `Type<unknown>` replaces `Type<any>`

## Completed: OnPush + Zoneless

All components use `ChangeDetectionStrategy.OnPush` and the app runs without zone.js.

- [x] `ChangeDetectionStrategy.OnPush` on every component (library + demo)
- [x] Removed `zone.js` from `package.json` and all `polyfills` in `angular.json`
- [x] `provideZonelessChangeDetection()` in demo bootstrap
- [x] Removed `@angular/platform-browser-dynamic` dependency
- [x] All mutable state in `NgWizardComponent` converted to signals (`config`, `currentStepIndex`, `currentStep`, `isLoading`)
- [x] All style strings converted to `computed()` signals (`mainClass`, `stepClass`, `toolbarTopClass`, `toolbarBottomClass`, `previousButtonClass`, `nextButtonClass`)
- [x] All toolbar visibility booleans converted to `computed()` signals
- [x] Removed `ChangeDetectorRef.detectChanges()` — signals handle change detection automatically
- [x] Removed `ngOnDestroy` — `takeUntilDestroyed()` handles cleanup
- [x] Cleaned up demo step components (removed empty constructors, `OnInit`, etc.)

## Completed: Testing Updates (Phase 1)

All spec files run green under zoneless change detection (5 library + 10 demo specs) on Angular 21.2.17.

- [x] Update all spec files for standalone components
- [x] Add `provideZonelessChangeDetection()` to test providers (present in all 14 specs)
- [x] Replace `declarations` with `imports` in `TestBed.configureTestingModule()` (no `declarations` remain)
- [x] Remove `async()` from `@angular/core/testing` (only native `async () =>` arrow functions remain)

## Remaining: Modernization Phases

### Phase 2: Cleanup

- [ ] Remove empty `ngOnInit()` / `implements OnInit` where unused
- [ ] Remove empty constructors
- [ ] Replace `styleUrls` (array) with `styleUrl` (singular)
- [ ] Eliminate all remaining `any` types
- [ ] Delete `.angular/cache` old build artifacts

## Breaking Changes for Library Consumers

When all phases are complete:

1. **`NgWizardModule` removed** → Use `provideNgWizard(options)` instead of `NgWizardModule.forRoot(options)`
2. **Components are standalone** → Import `NgWizardComponent` and `NgWizardStepComponent` directly
3. **`NgWizardStep` abstract class removed** → Use `NgWizardStepData` interface
4. **`NgWizardService.stepChanged()`** returns `Signal` instead of `Observable`
5. **zone.js no longer required**
6. **Minimum Angular version: 21**
