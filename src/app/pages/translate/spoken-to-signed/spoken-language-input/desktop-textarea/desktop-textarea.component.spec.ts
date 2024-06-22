import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DesktopTextareaComponent} from './desktop-textarea.component';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../../core/modules/ngxs/ngxs.module';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '../../../../../modules/translate/translate.module';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('DesktopTextareaComponent', () => {
  let component: DesktopTextareaComponent;
  let fixture: ComponentFixture<DesktopTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopTextareaComponent],
      imports: [ReactiveFormsModule, NgxsModule.forRoot([SettingsState], ngxsConfig), TranslateModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
