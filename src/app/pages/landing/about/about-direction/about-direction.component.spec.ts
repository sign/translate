import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutDirectionComponent} from './about-direction.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';

describe('AboutDirectionComponent', () => {
  let component: AboutDirectionComponent;
  let fixture: ComponentFixture<AboutDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutDirectionComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDirectionComponent);
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
