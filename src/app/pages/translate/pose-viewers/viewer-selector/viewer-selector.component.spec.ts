import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {ViewerSelectorComponent} from './viewer-selector.component';

import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';

describe('ViewerSelectorComponent', () => {
  let component: ViewerSelectorComponent;
  let fixture: ComponentFixture<ViewerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, NoopAnimationsModule, ViewerSelectorComponent],
      providers: [provideIonicAngular(), provideStore([SettingsState], ngxsConfig)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
