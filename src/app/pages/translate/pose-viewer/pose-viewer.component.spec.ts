import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseViewerComponent } from './pose-viewer.component';

describe('PoseViewerComponent', () => {
  let component: PoseViewerComponent;
  let fixture: ComponentFixture<PoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoseViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
