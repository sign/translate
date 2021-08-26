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
}
