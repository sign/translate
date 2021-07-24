import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignWritingComponent} from './sign-writing.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SignWritingComponent', () => {
  let component: SignWritingComponent;
  let fixture: ComponentFixture<SignWritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignWritingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
