import {Injectable} from '@angular/core';
import {drawWatermark} from '../helpers/watermark';

@Injectable({providedIn: 'root'})
export class FrameCacheService {
  private frames: ImageBitmap[] = [];
  private _fps = 0;
  get fps(): number {
    return this._fps;
  }

  reset(): void {
    this.frames = [];
    this._fps = 0;
  }

  addFrame(frame: ImageBitmap, fps?: number): void {
    this.frames.push(frame);
    if (fps) {
      this._fps = fps;
    }
  }

  async encodeWithWatermark(): Promise<Blob> {
    if (this.frames.length === 0) {
      throw new Error('No frames to encode');
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.frames[0].width;
    canvas.height = this.frames[0].height;
    const ctx = canvas.getContext('2d');

    const totalFrames = this.frames.length;
    const watermarkedFrames: ImageBitmap[] = [];
    for (let i = 0; i < totalFrames; i++) {
      ctx.drawImage(this.frames[i], 0, 0);
      drawWatermark(canvas, i, totalFrames, this._fps);
      watermarkedFrames.push(await createImageBitmap(canvas));
      if (i % 10 === 0) await new Promise(requestAnimationFrame);
    }

    const {PlayableVideoEncoder} = await import('../../pages/translate/pose-viewers/playable-video-encoder');
    if (PlayableVideoEncoder.isSupported()) {
      const encoder = new PlayableVideoEncoder(watermarkedFrames[0], this._fps);
      await encoder.init();
      for (const frame of watermarkedFrames) {
        await encoder.addFrame(frame);
        frame.close();
      }
      return encoder.finalize();
    }

    const stream = canvas.captureStream(this._fps);
    const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    const chunks: Blob[] = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    const done = new Promise<Blob>(resolve => {
      recorder.onstop = () => resolve(new Blob(chunks, {type: recorder.mimeType}));
    });
    recorder.start();
    for (const frame of watermarkedFrames) {
      ctx.drawImage(frame, 0, 0);
      frame.close();
      await new Promise(r => setTimeout(r, 1000 / this._fps));
    }
    recorder.stop();
    stream.getTracks().forEach(t => t.stop());
    return done;
  }
}
