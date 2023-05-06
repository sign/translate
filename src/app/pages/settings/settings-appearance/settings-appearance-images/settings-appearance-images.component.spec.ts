import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAppearanceImagesComponent} from './settings-appearance-images.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('SettingsAppearanceImagesComponent', () => {
  let component: SettingsAppearanceImagesComponent;
  let fixture: ComponentFixture<SettingsAppearanceImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAppearanceImagesComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState], ngxsConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAppearanceImagesComponent);
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
