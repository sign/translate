import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {ViewerSelectorComponent} from './viewer-selector.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('ViewerSelectorComponent', () => {
  let component: ViewerSelectorComponent;
  let fixture: ComponentFixture<ViewerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewerSelectorComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        NoopAnimationsModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig),
      ],
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
