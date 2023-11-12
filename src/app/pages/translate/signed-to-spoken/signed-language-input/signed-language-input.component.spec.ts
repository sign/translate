import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignedLanguageInputComponent} from './signed-language-input.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {UploadComponent} from '../upload/upload.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('SignedLanguageInputComponent', () => {
  let component: SignedLanguageInputComponent;
  let fixture: ComponentFixture<SignedLanguageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignedLanguageInputComponent, UploadComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot(), NgxsModule.forRoot([], ngxsConfig)],
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
