import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropPoseFileComponent} from './drop-pose-file.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {DropzoneDirective} from '../../../directives/dropzone.directive';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from '../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {HttpClientModule} from '@angular/common/http';
import {SettingsState} from '../../../modules/settings/settings.state';

describe('DropPoseFileComponent', () => {
  let component: DropPoseFileComponent;
  let fixture: ComponentFixture<DropPoseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropPoseFileComponent, DropzoneDirective],
      imports: [HttpClientModule, NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig)],
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
