import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateComponent} from './translate.component';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';

describe('TranslateComponent', () => {
  let component: TranslateComponent;
  let fixture: ComponentFixture<TranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TranslateComponent,
        LanguageSelectorComponent
      ],
      imports: [
        AppTranslocoModule,
        AppAngularMaterialModule,
        NgxsModule.forRoot([], ngxsConfig),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
