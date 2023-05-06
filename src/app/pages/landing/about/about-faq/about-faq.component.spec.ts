import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutFaqComponent} from './about-faq.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {IonicModule} from '@ionic/angular';

describe('AboutFaqComponent', () => {
  let component: AboutFaqComponent;
  let fixture: ComponentFixture<AboutFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutFaqComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot(), NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFaqComponent);
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
