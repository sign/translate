import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {RouterModule} from '@angular/router';
import {I18NLanguageSelectorComponent} from './i18n-language-selector.component';
import {languageCodeNormalizer, SITE_LANGUAGES} from '../../core/modules/transloco/languages';

describe('LanguageSelectorComponent', () => {
  let component: I18NLanguageSelectorComponent;
  let fixture: ComponentFixture<I18NLanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [I18NLanguageSelectorComponent],
      imports: [AppTranslocoTestingModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(I18NLanguageSelectorComponent);
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

  for (const lang of SITE_LANGUAGES) {
    it(`should support language ${lang.value} (code '${lang.key}')`, async () => {
      const key = languageCodeNormalizer(lang.key).toLowerCase();
      const files = [
        `assets/i18n/${key}.json`,
        `assets/i18n/countries/${key}.json`,
        `assets/i18n/languages/${key}.json`,
      ];

      const requests = await Promise.all(files.map(f => fetch(f)));
      for (const req of requests) {
        expect(req.ok).toBeTruthy();
      }

      const jsons = await Promise.all(requests.map(r => r.json()));
      for (const json of jsons) {
        const text = JSON.stringify(json);
        expect(text).not.toContain('&#'); // No URL Encoded characters
      }
    });
  }
});
