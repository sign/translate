import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignedLanguageInputComponent} from './signed-language-input.component';

describe('SignedLanguageInputComponent', () => {
  let component: SignedLanguageInputComponent;
  let fixture: ComponentFixture<SignedLanguageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignedLanguageInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignedLanguageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
