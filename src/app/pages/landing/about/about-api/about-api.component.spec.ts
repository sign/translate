import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutApiComponent} from './about-api.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {AppNgxsModule} from '../../../../core/modules/ngxs/ngxs.module';

describe('AboutApiComponent', () => {
  let component: AboutApiComponent;
  let fixture: ComponentFixture<AboutApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutApiComponent],
      imports: [AppTranslocoTestingModule, AppNgxsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutApiComponent);
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
