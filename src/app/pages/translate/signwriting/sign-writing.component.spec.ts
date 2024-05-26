import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SignWritingComponent} from './sign-writing.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {defineCustomElements as defineCustomElementsSW} from '@sutton-signwriting/sgnw-components/loader';
import {NgxsModule, Store} from '@ngxs/store';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {TranslateState, TranslateStateModel} from '../../../modules/translate/translate.state';
import {MatTooltipModule} from '@angular/material/tooltip';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {SettingsState} from '../../../modules/settings/settings.state';
import {provideHttpClient} from '@angular/common/http';

describe('SignWritingComponent', () => {
  let component: SignWritingComponent;
  let fixture: ComponentFixture<SignWritingComponent>;

  let store: Store;
  let snapshot: {translate: TranslateStateModel};

  beforeAll(async () => {
    await defineCustomElementsSW();
    await customElements.whenDefined('fsw-sign');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignWritingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig), MatTooltipModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    store = TestBed.inject(Store);
    snapshot = {...store.snapshot()};
    snapshot.translate = {...snapshot.translate};
    snapshot.translate.signWriting = [{fsw: 'M507x523S15a28494x496S26500493x477'}];
    store.reset(snapshot);

    fixture = TestBed.createComponent(SignWritingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });

  it('should change color when prefers-color-scheme changes', async () => {
    await customElements.whenDefined('fsw-sign');

    const getColor = async () => {
      const getSVG = () => {
        const el = fixture.nativeElement.querySelector('fsw-sign');
        if (!el) {
          return null;
        }
        const slot = el.shadowRoot.querySelector('slot');
        if (!slot) {
          return null;
        }
        return slot.assignedElements()[0];
      };

      let svg;
      while (!svg) {
        fixture.detectChanges();
        await new Promise(resolve => setTimeout(resolve, 10)); // Wait for element to be fully loaded
        svg = getSVG();
      }

      const textEl = svg.querySelector('text.sym-line');

      return textEl.getAttribute('fill');
    };

    const specialColor = '#012345';

    const currentColor = await getColor();
    expect(currentColor).not.toBe(specialColor);

    // Change element color
    fixture.nativeElement.style.color = specialColor;
    component.colorSchemeMedia.dispatchEvent(new Event('change'));

    const newColor = await getColor();
    expect(newColor).toBe(specialColor);
  }, 10000);
});
