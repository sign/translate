import type {Output, VideoSampleSource, VideoSample, VideoCodec} from 'mediabunny';

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

export class PlayableVideoEncoder {
  output: Output;
  bitmapSource: VideoSampleSource;

  container: 'webm' | 'mp4';
  codec: VideoCodec;
  bitrate = 10_000_000; // 10Mbps max! (https://github.com/Vanilagy/mp4-muxer/issues/36)

  width: number;
  height: number;
  fps: number;

  frameIndex = 0;

  constructor(
    private image: ImageBitmap,
    fps: number
  ) {
    this.fps = fps;
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
    const {Output, Mp4OutputFormat, BufferTarget, VideoSampleSource, QUALITY_HIGH} = await import('mediabunny');

    // Set the metadata
    this.container = 'mp4';
    this.codec = 'avc';

    // H264 only supports even sized frames
    this.width = this.image.width + (this.image.width % 2);
    this.height = this.image.height + (this.image.height % 2);

    // Create bitmap source
    this.bitmapSource = new VideoSampleSource({
      codec: this.codec,
      bitrate: QUALITY_HIGH,
    });

    // Create the output
    this.output = new Output({
      format: new Mp4OutputFormat({
        fastStart: 'in-memory',
      }),
      target: new BufferTarget(),
    });

    // Add video track
    this.output.addVideoTrack(this.bitmapSource);

    // Start the output
    await this.output.start();
  }

  async addFrame(image: ImageBitmap) {
    const timestamp = this.frameIndex / this.fps;
    const duration = 1 / this.fps;

    const {VideoSample} = await import('mediabunny');
    const sample = new VideoSample(image, {
      timestamp,
      duration,
    });
    await this.bitmapSource.add(sample);

    this.frameIndex++;
  }

  async finalize() {
    this.bitmapSource.close();
    await this.output.finalize();

    const buffer = (this.output.target as any).buffer as ArrayBuffer;
    return new Blob([buffer], {type: `video/${this.container}`});
  }

  close() {
    if (this.bitmapSource) {
      this.bitmapSource.close();
      delete this.bitmapSource;
    }
    if (this.output) {
      delete this.output;
    }
  }
}
