import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAppearanceImagesComponent} from './settings-appearance-images.component';
import {AppAngularMaterialModule} from '../../../../core/modules/angular-material/angular-material.module';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('SettingsAppearanceImagesComponent', () => {
  let component: SettingsAppearanceImagesComponent;
  let fixture: ComponentFixture<SettingsAppearanceImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAppearanceImagesComponent],
      imports: [
        AppAngularMaterialModule,
        AppTranslocoTestingModule,
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
