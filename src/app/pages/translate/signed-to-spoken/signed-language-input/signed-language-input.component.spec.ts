import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SignedLanguageInputComponent} from './signed-language-input.component';
import {provideTranslocoTesting} from '../../../../core/modules/transloco/transloco-testing.module';
import {UploadComponent} from '../upload/upload.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {ngxsConfig} from '../../../../app.config';
import {provideIonicAngular} from '@ionic/angular/standalone';

describe('SignedLanguageInputComponent', () => {
  let component: SignedLanguageInputComponent;
  let fixture: ComponentFixture<SignedLanguageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        provideTranslocoTesting(),
        provideIonicAngular(),
        provideStore([], ngxsConfig),
        SignedLanguageInputComponent,
        UploadComponent,
      ],
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
