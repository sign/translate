import {TestBed} from '@angular/core/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {VideoState, VideoStateModel} from './video.state';
import {StartCamera, StopVideo} from './video.actions';
import {NavigatorService} from '../../../../services/navigator/navigator.service';
import {firstValueFrom} from 'rxjs';
import {ngxsConfig} from '../../ngxs.module';

describe('VideoState', () => {
  let store: Store;
  let navigatorService: NavigatorService;
  let snapshot: {video: VideoStateModel};

  let mockCamera: MediaStream;
  let mockSettings: MediaTrackSettings;
  let mockTrack: MediaStreamVideoTrack;

  beforeAll(() => {
    // Setup mock camera
    mockSettings = {
      aspectRatio: 2,
      frameRate: 30,
      height: 720,
      width: 1280,
    };
    mockTrack = {
      getSettings: () => mockSettings,
      addEventListener: (() => {}) as any,
    } as MediaStreamVideoTrack;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([VideoState], ngxsConfig)],
      providers: [NavigatorService],
    });

    mockCamera = new MediaStream();

    store = TestBed.inject(Store);
    navigatorService = TestBed.inject(NavigatorService);
    snapshot = {...store.snapshot()};
    snapshot.video = {...snapshot.video};
  });

  it('StopVideo should stop camera', () => {
    snapshot.video.camera = new MediaStream();
    store.reset(snapshot);

    store.dispatch(new StopVideo());

    const camera = store.selectSnapshot(state => state.video.camera);
    expect(camera).toBe(null);
  });

  it('StopVideo should set error to turnedOff', () => {
    snapshot.video.error = null;
    store.reset(snapshot);

    store.dispatch(new StopVideo());

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe('turnedOff');
  });

  it('StopVideo should keep error if exists', () => {
    const testError = 'testError';
    snapshot.video.error = testError;
    store.reset(snapshot);

    store.dispatch(new StopVideo());

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe(testError);
  });

  it('StartCamera error should update store', async () => {
    const testError = 'testError';
    const spy = spyOn(navigatorService, 'getCamera').and.throwError(new Error(testError));

    snapshot.video.error = null;
    store.reset(snapshot);

    await firstValueFrom(store.dispatch(StartCamera));

    expect(spy).toHaveBeenCalled();

    const error = store.selectSnapshot(state => state.video.error);
    expect(error).toBe(testError);
  });

  it('StartCamera should get camera from navigator', async () => {
    // Setup mock camera
    const tracksSpy = spyOn(mockCamera, 'getVideoTracks').and.returnValue([mockTrack]);
    const cameraSpy = spyOn(navigatorService, 'getCamera').and.returnValue(Promise.resolve(mockCamera));
    const listenerSpy = spyOn(mockTrack, 'addEventListener');

    await firstValueFrom(store.dispatch(StartCamera));

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

    await firstValueFrom(store.dispatch(StartCamera));

    expect(tracksSpy).toHaveBeenCalled();
    expect(cameraSpy).toHaveBeenCalled();

    const {videoSettings, error} = store.selectSnapshot(state => state.video);

    expect(error).toBe(null);
    expect(videoSettings.aspectRatio).toBe('2-1');
    expect(videoSettings.height).toBe(mockSettings.height);
    expect(videoSettings.width).toBe(mockSettings.width);
    expect(videoSettings.frameRate).toBe(mockSettings.frameRate);
  });

  const aspectRatios = {
    '2-1': {w: 2000, h: 1000},
    '1-1': {w: 2000, h: 2000},
    '4-3': {w: 2000, h: 1500},
    '16-9': {w: 1920, h: 1080},
  };
  for (const [ratio, {w, h}] of Object.entries(aspectRatios)) {
    it(`Resolution ${w}:${h} should be of ratio "${ratio}"`, () => {
      expect(VideoState.aspectRatio(w / h)).toEqual(ratio);
    });
  }
});
