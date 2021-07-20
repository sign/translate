import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSelectorComponent} from './language-selector.component';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {AppAngularMaterialModule} from '../../../core/modules/angular-material/angular-material.module';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [
        AppTranslocoModule,
        AppAngularMaterialModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    component.translationKey = 'translate.languages.spoken';
    component.languages = ['en', 'fr', 'de'];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
