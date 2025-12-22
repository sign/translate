import type {Output, CanvasSource, VideoSampleSource, VideoSample, VideoCodec} from 'mediabunny';

export function getMediaSourceClass(): typeof MediaSource {
  if ('ManagedMediaSource' in window) {
    return window.ManagedMediaSource as any;
  }
  if ('MediaSource' in window) {
    return MediaSource;
  }
  if ('WebKitMediaSource' in window) {
    return window['WebKitMediaSource'] as any;
  }

  console.warn('Neither ManagedMediaSource nor MediaSource are supported on this device');

  return null;
}

type EncoderMode = 'canvas' | 'bitmap';

export class PlayableVideoEncoder {
  output: Output;
  canvasSource: CanvasSource;
  bitmapSource: VideoSampleSource;

  container: 'webm' | 'mp4';
  codec: VideoCodec;
  bitrate = 10_000_000; // 10Mbps max! (https://github.com/Vanilagy/mp4-muxer/issues/36)

  width: number;
  height: number;
  fps: number;
  mode: EncoderMode;

  frameIndex = 0;

  constructor(
    private canvas: HTMLCanvasElement | null,
    private image: ImageBitmap | null,
    fps: number
  ) {
    this.fps = fps;
    this.mode = canvas ? 'canvas' : 'bitmap';
  }

  static isSupported() {
    return 'VideoEncoder' in globalThis;
  }

  async init() {
    // For maximum *sharing* compatibility, use MP4 by default
    await this.createMP4Output();
  }

  async isPlayable() {
    if (!('navigator' in globalThis)) {
      return false;
    }

    if (!('mediaCapabilities' in navigator)) {
      const mediaSourceClass = getMediaSourceClass();
      if (!mediaSourceClass) {
        return false;
      }

      const mimeType = `video/${this.container}; codecs="${this.codec}"`;
      return mediaSourceClass.isTypeSupported(mimeType);
    }

    const videoConfig = {
      contentType: `video/${this.container}; codecs="${this.codec}"`,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      framerate: this.fps,
    };

    const {supported} = await navigator.mediaCapabilities.decodingInfo({type: 'file', video: videoConfig});
    return supported;
  }

  async createMP4Output() {
    const {Output, Mp4OutputFormat, BufferTarget, CanvasSource, VideoSampleSource, QUALITY_HIGH} =
      await import('mediabunny');

    // Set the metadata
    this.container = 'mp4';
    this.codec = 'avc';

    if (this.mode === 'canvas') {
      // H264 only supports even sized frames
      const originalWidth = this.canvas.width;
      const originalHeight = this.canvas.height;
      this.width = originalWidth + (originalWidth % 2);
      this.height = originalHeight + (originalHeight % 2);

      // Note: We don't resize the canvas as it may be actively rendering
      // CanvasSource will handle the size

      // Create canvas source
      this.canvasSource = new CanvasSource(this.canvas, {
        codec: this.codec,
        bitrate: QUALITY_HIGH,
      });
    } else {
      // H264 only supports even sized frames
      this.width = this.image.width + (this.image.width % 2);
      this.height = this.image.height + (this.image.height % 2);

      // Create bitmap source
      this.bitmapSource = new VideoSampleSource({
        codec: this.codec,
        bitrate: QUALITY_HIGH,
      });
    }

    // Create the output
    this.output = new Output({
      format: new Mp4OutputFormat({
        fastStart: 'in-memory',
      }),
      target: new BufferTarget(),
    });

    // Add video track
    if (this.mode === 'canvas') {
      this.output.addVideoTrack(this.canvasSource);
    } else {
      this.output.addVideoTrack(this.bitmapSource);
    }

    // Start the output
    await this.output.start();
  }

  async addFrame(image?: ImageBitmap) {
    const timestamp = this.frameIndex / this.fps;
    const duration = 1 / this.fps;

    if (this.mode === 'canvas') {
      // For canvas mode, capture the current canvas state
      await this.canvasSource.add(timestamp, duration);
    } else {
      // For bitmap mode, create a VideoSample from the ImageBitmap
      if (!image) {
        throw new Error('ImageBitmap required for bitmap mode');
      }
      const {VideoSample} = await import('mediabunny');
      const sample = new VideoSample(image, {
        timestamp,
        duration,
      });
      await this.bitmapSource.add(sample);
    }

    this.frameIndex++;
  }

  async finalize() {
    if (this.mode === 'canvas') {
      this.canvasSource.close();
    } else {
      this.bitmapSource.close();
    }

    await this.output.finalize();

    const buffer = (this.output.target as any).buffer as ArrayBuffer;
    return new Blob([buffer], {type: `video/${this.container}`});
  }

  close() {
    if (this.canvasSource) {
      this.canvasSource.close();
      delete this.canvasSource;
    }
    if (this.bitmapSource) {
      this.bitmapSource.close();
      delete this.bitmapSource;
    }
    if (this.output) {
      delete this.output;
    }
  }
}
