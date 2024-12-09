import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SettingsAboutComponent} from './settings-about.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {provideRouter} from '@angular/router';

describe('SettingsAboutComponent', () => {
  let component: SettingsAboutComponent;
  let fixture: ComponentFixture<SettingsAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SettingsAboutComponent],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAboutComponent);
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
