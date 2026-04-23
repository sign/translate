import {drawWatermark} from './watermark';

export async function watermarkVideoBlob(sourceUrl: string): Promise<Blob> {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.src = sourceUrl;

  await new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error('Failed to load video'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');

  const fps = 30;
  const duration = video.duration;
  const frameCount = Math.ceil(duration * fps);

  const frames: ImageBitmap[] = [];

  for (let i = 0; i < frameCount; i++) {
    video.currentTime = i / fps;
    await new Promise<void>(resolve => {
      video.onseeked = () => resolve();
    });
    ctx.drawImage(video, 0, 0);
    drawWatermark(canvas);
    frames.push(await createImageBitmap(canvas));
  }

  if ('VideoEncoder' in globalThis) {
    const {PlayableVideoEncoder} = await import('../../pages/translate/pose-viewers/playable-video-encoder');
    const encoder = new PlayableVideoEncoder(frames[0], fps);
    await encoder.init();
    for (const frame of frames) {
      await encoder.addFrame(frame);
      frame.close();
    }
    return encoder.finalize();
  }

  canvas.getContext('2d');
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
  const chunks: Blob[] = [];

  recorder.ondataavailable = e => chunks.push(e.data);

  const done = new Promise<Blob>(resolve => {
    recorder.onstop = () => resolve(new Blob(chunks, {type: recorder.mimeType}));
  });

  recorder.start();

  for (const frame of frames) {
    ctx.drawImage(frame, 0, 0);
    frame.close();
    await new Promise(r => setTimeout(r, 1000 / fps));
  }

  recorder.stop();
  stream.getTracks().forEach(t => t.stop());

  return done;
}
