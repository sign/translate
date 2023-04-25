import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutOfflineComponent} from './about-offline.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {AppAngularMaterialModule} from '../../../../core/modules/angular-material/angular-material.module';
import {IonicModule} from '@ionic/angular';

describe('AboutOfflineComponent', () => {
  let component: AboutOfflineComponent;
  let fixture: ComponentFixture<AboutOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutOfflineComponent],
      imports: [AppTranslocoTestingModule, AppAngularMaterialModule, IonicModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOfflineComponent);
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
