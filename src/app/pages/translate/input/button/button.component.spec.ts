import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateInputButtonComponent} from './button.component';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateState} from '../../../../modules/translate/translate.state';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';

describe('TranslateInputButtonComponent', () => {
  let component: TranslateInputButtonComponent;
  let fixture: ComponentFixture<TranslateInputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslateInputButtonComponent],
      imports: [MatButtonModule, MatIconModule, AppTranslocoModule, NgxsModule.forRoot([TranslateState], ngxsConfig)],
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
});
