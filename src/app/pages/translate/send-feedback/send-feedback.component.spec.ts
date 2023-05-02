import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendFeedbackComponent} from './send-feedback.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';

describe('SendFeedbackComponent', () => {
  let component: SendFeedbackComponent;
  let fixture: ComponentFixture<SendFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendFeedbackComponent],
      imports: [AppTranslocoTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SendFeedbackComponent);
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
