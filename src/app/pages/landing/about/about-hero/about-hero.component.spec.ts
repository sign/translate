import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHeroComponent } from './about-hero.component';

describe('AboutHeroComponent', () => {
  let component: AboutHeroComponent;
  let fixture: ComponentFixture<AboutHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutHeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
