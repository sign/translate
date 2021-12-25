import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceComponent } from './appearance.component';

describe('AppearanceComponent', () => {
  let component: AppearanceComponent;
  let fixture: ComponentFixture<AppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppearanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
