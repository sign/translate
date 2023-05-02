import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LicensesComponent} from './licenses.component';
import {HttpClientModule} from '@angular/common/http';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('LicensesComponent', () => {
  let component: LicensesComponent;
  let fixture: ComponentFixture<LicensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicensesComponent],
      imports: [HttpClientModule, MatTreeModule, CdkTreeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LicensesComponent);
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
