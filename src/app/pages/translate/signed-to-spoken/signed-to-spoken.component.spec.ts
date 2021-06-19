import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedToSpokenComponent } from './signed-to-spoken.component';

describe('SignedToSpokenComponent', () => {
  let component: SignedToSpokenComponent;
  let fixture: ComponentFixture<SignedToSpokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignedToSpokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedToSpokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
