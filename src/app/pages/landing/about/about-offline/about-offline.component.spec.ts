import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutOfflineComponent} from './about-offline.component';

describe('AboutOfflineComponent', () => {
  let component: AboutOfflineComponent;
  let fixture: ComponentFixture<AboutOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutOfflineComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
