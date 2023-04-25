import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {UploadComponent} from './upload.component';
import {NgxsModule, Store} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {SetVideo} from '../../../../core/modules/ngxs/store/video/video.actions';
import {IonicModule} from '@ionic/angular';
import createSpy = jasmine.createSpy;

function createFileFromMockFile(name: string, body: string, mimeType: string): File {
  const blob = new Blob([body], {type: mimeType}) as any;
  blob.lastModifiedDate = new Date();
  blob.name = name;
  return blob as File;
}

describe('UploadComponent', () => {
  let store: Store;
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot(), NgxsModule.forRoot([], ngxsConfig)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });

  it('upload button should click button', () => {
    const spy = createSpy('click').and.callFake(e => {
      e.stopPropagation();
      e.preventDefault();
    });

    component.uploadEl.addEventListener('click', spy);
    component.upload();

    expect(spy).toHaveBeenCalled();
  });

  it('no file upload should not dispatch update', () => {
    const spy = spyOn(store, 'dispatch');

    component.onFileUpload();

    expect(spy).not.toHaveBeenCalled();
  });

  it('file upload should dispatch url', () => {
    const spy = spyOn(store, 'dispatch');
    const mockFile = createFileFromMockFile('test.mp4', '', 'video/mp4');
    const mockFileList = [mockFile] as unknown as FileList;
    spyOnProperty(component.uploadEl, 'files', 'get').and.returnValue(mockFileList);

    component.onFileUpload();

    expect(spy).toHaveBeenCalled();
    const arg = spy.calls.first().args[0];
    expect(arg instanceof SetVideo).toBeTrue();
    expect(arg.src).toContain('blob:http');
  });
});
