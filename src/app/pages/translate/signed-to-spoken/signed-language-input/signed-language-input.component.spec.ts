import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SignedLanguageInputComponent} from './signed-language-input.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {ngxsConfig} from '../../../../app.config';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {provideStore} from '@ngxs/store';

describe('SignedLanguageInputComponent', () => {
  let component: SignedLanguageInputComponent;
  let fixture: ComponentFixture<SignedLanguageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SignedLanguageInputComponent],
      providers: [provideIonicAngular(), provideStore([], ngxsConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(SignedLanguageInputComponent);
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
