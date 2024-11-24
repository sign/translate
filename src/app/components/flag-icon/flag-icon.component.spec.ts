import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagIconComponent} from './flag-icon.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('FlagIconComponent', () => {
  let component: FlagIconComponent;
  let fixture: ComponentFixture<FlagIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagIconComponent);
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

  it('should apply the country input to the class attribute of the span element', () => {
    component.country = 'us';
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.classList.contains('fi-us')).toBeTruthy();
  });

  it('should apply the squared input to the class attribute of the span element', () => {
    component.squared = true;
    fixture.detectChanges();

    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.classList.contains('fis')).toBeTruthy();
  });

  it('should default the squared input to false if it is not provided', () => {
    const spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.classList.contains('fis')).toBeFalsy();
  });

  it('should update the class attribute of the span element when the inputs change', () => {
    component.country = 'us';
    component.squared = true;
    fixture.detectChanges();

    let spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.classList.contains('fi-us')).toBeTruthy();
    expect(spanElement.classList.contains('fis')).toBeTruthy();

    component.country = 'jp';
    component.squared = false;
    fixture.detectChanges();

    spanElement = fixture.nativeElement.querySelector('span');
    expect(spanElement.classList.contains('fi-jp')).toBeTruthy();
    expect(spanElement.classList.contains('fis')).toBeFalsy();
  });
});
