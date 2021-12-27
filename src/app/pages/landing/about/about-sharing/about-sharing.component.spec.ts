import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutSharingComponent} from './about-sharing.component';

describe('AboutSharingComponent', () => {
  let component: AboutSharingComponent;
  let fixture: ComponentFixture<AboutSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSharingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
