import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {BenchmarkItemComponent} from './benchmark-item.component';
import {IonicModule} from '@ionic/angular';

describe('BenchmarkItemComponent', () => {
  let component: BenchmarkItemComponent;
  let fixture: ComponentFixture<BenchmarkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BenchmarkItemComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkItemComponent);
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
