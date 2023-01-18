import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutFaqComponent} from './about-faq.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {AppAngularMaterialModule} from '../../../../core/modules/angular-material/angular-material.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('AboutFaqComponent', () => {
  let component: AboutFaqComponent;
  let fixture: ComponentFixture<AboutFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutFaqComponent],
      imports: [AppTranslocoTestingModule, AppAngularMaterialModule, MatExpansionModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFaqComponent);
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
