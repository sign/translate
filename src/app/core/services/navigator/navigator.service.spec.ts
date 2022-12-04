import {TestBed} from '@angular/core/testing';

import {NavigatorService} from './navigator.service';

describe('NavigatorService', () => {
  let service: NavigatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigatorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should throw an error if permission is denied', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.rejectWith(new Error('Permission denied'));

    await expectAsync(service.getCamera({})).toBeRejectedWithError('permissionDenied');
  });

  it('should throw an error if the camera is not connected', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(null));

    await expectAsync(service.getCamera({})).toBeRejectedWithError('notConnected');
  });

  it('should return a MediaStream if the camera is connected', async () => {
    const mockMediaStream = new MediaStream();
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(mockMediaStream));

    const result = await service.getCamera({});
    expect(result).toBeDefined();
    expect(result).toEqual(mockMediaStream);
  });

  it('any random error should reject with device is not connected', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject(new Error('bla')));

    await expectAsync(service.getCamera({})).toBeRejectedWithError('notConnected');
  });

  it('should return a MediaStream if the camera is connected', async () => {
    const mockMediaStream = new MediaStream();
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve(mockMediaStream));

    const result = await service.getCamera({});
    expect(result).toBeDefined();
    expect(result).toEqual(mockMediaStream);
  });
});
