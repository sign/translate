import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutHeroComponent} from './about-hero.component';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {provideRouter} from '@angular/router';

describe('AboutHeroComponent', () => {
  let component: AboutHeroComponent;
  let fixture: ComponentFixture<AboutHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, NoopAnimationsModule, AboutHeroComponent],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHeroComponent);
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
