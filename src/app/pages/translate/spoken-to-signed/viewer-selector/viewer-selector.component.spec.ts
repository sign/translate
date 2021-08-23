import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewerSelectorComponent} from './viewer-selector.component';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {MatFabMenuModule} from '@angular-material-extensions/fab-menu';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('ViewerSelectorComponent', () => {
  let component: ViewerSelectorComponent;
  let fixture: ComponentFixture<ViewerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewerSelectorComponent],
      imports: [
        AppTranslocoModule,
        MatFabMenuModule,
        NoopAnimationsModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
