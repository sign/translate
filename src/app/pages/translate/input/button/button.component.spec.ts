import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {TranslateInputButtonComponent} from './button.component';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateState} from '../../../../modules/translate/translate.state';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {HttpClientModule} from '@angular/common/http';
import {SettingsState} from '../../../../modules/settings/settings.state';

describe('TranslateInputButtonComponent', () => {
  let component: TranslateInputButtonComponent;
  let fixture: ComponentFixture<TranslateInputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslateInputButtonComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        AppTranslocoTestingModule,
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateInputButtonComponent);
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
