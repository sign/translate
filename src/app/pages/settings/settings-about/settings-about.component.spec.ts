import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAboutComponent} from './settings-about.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SettingsAboutComponent', () => {
  let component: SettingsAboutComponent;
  let fixture: ComponentFixture<SettingsAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAboutComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAboutComponent);
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
