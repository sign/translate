import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DropPoseFileComponent} from './drop-pose-file.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideStore} from '@ngxs/store';
import {TranslateState} from '../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../app.config';
import {SettingsState} from '../../../modules/settings/settings.state';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('DropPoseFileComponent', () => {
  let component: DropPoseFileComponent;
  let fixture: ComponentFixture<DropPoseFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropPoseFileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
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
