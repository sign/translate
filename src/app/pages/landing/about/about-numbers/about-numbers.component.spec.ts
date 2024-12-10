import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutNumbersComponent} from './about-numbers.component';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('AboutNumbersComponent', () => {
  let component: AboutNumbersComponent;
  let fixture: ComponentFixture<AboutNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutNumbersComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutNumbersComponent);
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
