import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateInputButtonComponent } from './button.component';

describe('TranslateInputButtonComponent', () => {
  let component: TranslateInputButtonComponent;
  let fixture: ComponentFixture<TranslateInputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslateInputButtonComponent ]
    })
    .compileComponents();
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
