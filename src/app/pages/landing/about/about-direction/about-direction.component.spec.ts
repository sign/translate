import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutDirectionComponent} from './about-direction.component';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';

describe('AboutDirectionComponent', () => {
  let component: AboutDirectionComponent;
  let fixture: ComponentFixture<AboutDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, AboutDirectionComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDirectionComponent);
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
