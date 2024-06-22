import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {LanguageSelectorComponent} from './language-selector.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {TranslateState} from '../../../modules/translate/translate.state';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {provideHttpClient} from '@angular/common/http';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        MatTabsModule,
        MatMenuModule,
        NoopAnimationsModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    component.translationKey = 'languages';
    component.languages = ['en', 'fr', 'de'];
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

  it('select the same language should do nothing', () => {
    const {language, topLanguages} = component;

    component.selectLanguageIndex(component.selectedIndex);

    expect(component.language).toEqual(language);
    expect(component.topLanguages).toEqual(topLanguages);
  });

  it('selecting language detection should set index to 0', () => {
    component.hasLanguageDetection = true;
    component.language = 'unk';

    component.selectLanguage(null);

    expect(component.selectedIndex).toEqual(0);
  });

  it('selecting first language without detection should be index 0', () => {
    component.hasLanguageDetection = false;
    component.language = 'unk';

    component.selectLanguage(component.topLanguages[0]);

    expect(component.selectedIndex).toEqual(0);
  });

  it('selecting first language with detection should be index 1', () => {
    component.hasLanguageDetection = true;
    component.language = 'unk';

    component.selectLanguage(component.topLanguages[0]);

    expect(component.selectedIndex).toEqual(1);
  });

  it('selecting unknown language should be first in top', () => {
    component.hasLanguageDetection = false;
    const topLanguagesCount = component.topLanguages.length;

    component.selectLanguage('unk');

    expect(component.language).toEqual('unk');
    expect(component.topLanguages[0]).toEqual('unk');
    expect(component.selectedIndex).toEqual(0);
    expect(component.topLanguages.length).toEqual(topLanguagesCount);
  });

  it('selecting language index 0 with detection should be null', () => {
    component.hasLanguageDetection = true;
    const spy = spyOn(component, 'selectLanguage');

    component.selectLanguageIndex(0);

    expect(spy).toHaveBeenCalledOnceWith(null);
  });

  it('selecting language index 0 without detection should be first language', () => {
    component.hasLanguageDetection = false;
    const spy = spyOn(component, 'selectLanguage');
    const topLanguage = component.topLanguages[0];

    component.selectLanguageIndex(0);

    expect(spy).toHaveBeenCalledOnceWith(topLanguage);
  });

  it('selecting language index 1 with detection should be first language', () => {
    component.hasLanguageDetection = true;
    const spy = spyOn(component, 'selectLanguage');
    const topLanguage = component.topLanguages[0];

    component.selectLanguageIndex(1);

    expect(spy).toHaveBeenCalledOnceWith(topLanguage);
  });
});
