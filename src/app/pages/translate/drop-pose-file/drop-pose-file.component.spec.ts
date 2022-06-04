import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropPoseFileComponent} from './drop-pose-file.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('DropPoseFileComponent', () => {
  let component: DropPoseFileComponent;
  let fixture: ComponentFixture<DropPoseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropPoseFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropPoseFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
