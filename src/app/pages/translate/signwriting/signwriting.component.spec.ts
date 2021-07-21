import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignwritingComponent} from './signwriting.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SignwritingComponent', () => {
  let component: SignwritingComponent;
  let fixture: ComponentFixture<SignwritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignwritingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
