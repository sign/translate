import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PoseViewerComponent} from './pose-viewer.component';
import {Pix2PixModule} from '../../../modules/pix2pix/pix2pix.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('PoseViewerComponent', () => {
  let component: PoseViewerComponent;
  let fixture: ComponentFixture<PoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoseViewerComponent],
      imports: [
        Pix2PixModule,
        MatProgressBarModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
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
