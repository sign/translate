import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DesktopTextareaComponent} from './desktop-textarea.component';
import {SettingsState} from '../../../../../modules/settings/settings.state';
import {FormControl} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideStore} from '@ngxs/store';
import {TranslateState} from '../../../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../../../app.config';

describe('DesktopTextareaComponent', () => {
  let component: DesktopTextareaComponent;
  let fixture: ComponentFixture<DesktopTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopTextareaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesktopTextareaComponent);
    component = fixture.componentInstance;
    component.textControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
