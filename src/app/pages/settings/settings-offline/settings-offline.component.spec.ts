import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsOfflineComponent} from './settings-offline.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {AppNgxsModule} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {NgxFilesizeModule} from 'ngx-filesize';
import {IonicModule} from '@ionic/angular';

describe('SettingsOfflineComponent', () => {
  let component: SettingsOfflineComponent;
  let fixture: ComponentFixture<SettingsOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsOfflineComponent],
      imports: [
        MatTreeModule,
        IonicModule.forRoot(),
        CdkTreeModule,
        NgxFilesizeModule,
        AppTranslocoTestingModule,
        AppNgxsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsOfflineComponent);
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
