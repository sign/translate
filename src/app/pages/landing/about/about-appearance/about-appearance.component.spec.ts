import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAppearanceComponent } from './about-appearance.component';

describe('AboutAppearanceComponent', () => {
  let component: AboutAppearanceComponent;
  let fixture: ComponentFixture<AboutAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutAppearanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
