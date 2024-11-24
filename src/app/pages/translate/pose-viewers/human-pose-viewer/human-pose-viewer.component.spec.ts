import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {HumanPoseViewerComponent} from './human-pose-viewer.component';
import {Pix2PixModule} from '../../../../modules/pix2pix/pix2pix.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';


describe('HumanPoseViewerComponent', () => {
  let component: HumanPoseViewerComponent;
  let fixture: ComponentFixture<HumanPoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Pix2PixModule,
        provideIonicAngular(),
       provideStore([SettingsState], ngxsConfig),
        provideTranslocoTesting(),
        HumanPoseViewerComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanPoseViewerComponent);
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
