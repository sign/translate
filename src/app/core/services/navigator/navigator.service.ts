import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  async getCamera(options: MediaTrackConstraints): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({audio: false, video: options});
    } catch (e) {
      if (e.message.includes('Permission denied')) {
        throw new Error('permissionDenied');
      } else {
        throw new Error('notConnected');
      }
    }
  }

  async getMicrophone(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({audio: true});
    } catch (e) {
      if (e.message.includes('Permission denied')) {
        throw new Error('permissionDenied');
      } else {
        throw new Error('notConnected');
      }
    }
  }

  async getSpeaker(allowedLabels: Set<string>): Promise<MediaDeviceInfo> {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const device = devices.find(d => d.kind === 'audiooutput' && allowedLabels.has(d.label));
    if (!device) {
      throw new Error('missingSpeaker');
    }
    return device;
  }
}
