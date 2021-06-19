import {TestBed} from '@angular/core/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {VideoState, VideoStateModel} from './video.state';
import {StartCamera, StopCamera} from './video.actions';
import {NavigatorService} from '../../../../services/navigator/navigator.service';


describe('VideoState', () => {
  let store: Store;
  let navigatorService: NavigatorService;
  let snapshot: { video: VideoStateModel };

  let mockCamera: MediaStream;
  let mockSettings: MediaTrackSettings;
  let mockTrack: MediaStreamTrack;

  beforeAll(() => {
    // Setup mock camera
    mockCamera = new MediaStream();
    mockSettings = {
      aspectRatio: 2,
      frameRate: 30,
      height: 720,
      width: 1280
    };
    mockTrack = {
      getSettings: () => mockSettings,
      addEventListener: (() => {
      }) as any
    } as MediaStreamTrack;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([VideoState])],
      providers: [NavigatorService]
    });

    store = TestBed.inject(Store);
    navigatorService = TestBed.inject(NavigatorService);
    snapshot = store.snapshot();
  });

  it('StopCamera should stop camera', () => {
    snapshot.video.camera = new MediaStream();
    store.reset(snapshot);

    store.dispatch(new StopCamera());

    const camera = store.selectSnapshot(state => state.video.camera);
    expect(camera).toBe(null);
  });

  it('StopCamera should set error to turnedOff', () => {
    snapshot.video.error = null;
    store.reset(snapshot);

    store.dispatch(new StopCamera());

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe('turnedOff');
  });

  it('StopCamera should keep error if exists', () => {
    const testError = 'testError';
    snapshot.video.error = testError;
    store.reset(snapshot);

    store.dispatch(new StopCamera());

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe(testError);
  });

  it('StartCamera error should update store', () => {
    const testError = 'testError';
    const spy = spyOn(navigatorService, 'getCamera').and.throwError(new Error(testError));

    snapshot.video.error = null;
    store.reset(snapshot);

    store.dispatch(new StartCamera());

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe(testError);
  });

  it('StartCamera should get camera from navigator', async () => {
    // Setup mock camera
    const tracksSpy = spyOn(mockCamera, 'getVideoTracks').and.returnValue([mockTrack]);
    const cameraSpy = spyOn(navigatorService, 'getCamera').and.returnValue(Promise.resolve(mockCamera));
    const listenerSpy = spyOn(mockTrack, 'addEventListener');

    await store.dispatch(new StartCamera()).toPromise();

    expect(tracksSpy).toHaveBeenCalled();
    expect(cameraSpy).toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();

    const {camera, error} = store.selectSnapshot(state => state.video);

    expect(error).toBe(null);
    expect(camera).toBe(mockCamera);
  });

  it('StartCamera should set camera settings', async () => {
    const tracksSpy = spyOn(mockCamera, 'getVideoTracks').and.returnValue([mockTrack]);
    const cameraSpy = spyOn(navigatorService, 'getCamera').and.returnValue(Promise.resolve(mockCamera));

    await store.dispatch(new StartCamera()).toPromise();

    expect(tracksSpy).toHaveBeenCalled();
    expect(cameraSpy).toHaveBeenCalled();

    const {videoSettings, error} = store.selectSnapshot(state => state.video);

    expect(error).toBe(null);
    expect(videoSettings.aspectRatio).toBe('2-1');
    expect(videoSettings.height).toBe(mockSettings.height);
    expect(videoSettings.width).toBe(mockSettings.width);
    expect(videoSettings.frameRate).toBe(mockSettings.frameRate);
  });
});
