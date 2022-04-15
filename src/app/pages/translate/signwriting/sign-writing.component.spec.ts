import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignWritingComponent} from './sign-writing.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {defineCustomElements as defineCustomElementsSW} from '@sutton-signwriting/sgnw-components/loader';

describe('SignWritingComponent', () => {
  let component: SignWritingComponent;
  let fixture: ComponentFixture<SignWritingComponent>;

  beforeAll(async () => {
    await defineCustomElementsSW();
    await customElements.whenDefined('fsw-sign');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignWritingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignWritingComponent);
    component = fixture.componentInstance;
    component.signs = ['M507x523S15a28494x496S26500493x477'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should unregister event listener on destroy', () => {
    const spy = spyOn(component.colorSchemeMedia, 'removeEventListener');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
