import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadComponent} from './upload.component';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [
        AppTranslocoModule,
        NgxsModule.forRoot([], ngxsConfig)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
