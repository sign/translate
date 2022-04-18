import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagIconComponent} from './flag-icon.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('FlagIconComponent', () => {
  let component: FlagIconComponent;
  let fixture: ComponentFixture<FlagIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlagIconComponent],
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
});
