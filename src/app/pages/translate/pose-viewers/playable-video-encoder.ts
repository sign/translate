import type {Output, EncodedVideoPacketSource} from 'mediabunny';
import {EncodedPacket} from 'mediabunny';

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
  packetSource: EncodedVideoPacketSource;
  videoEncoder: VideoEncoder;
  frameBuffer: VideoFrame[] = []; // Buffer frames until the encoder is ready

  container: 'webm' | 'mp4';
  codec: string;
  bitrate = 10_000_000; // 10Mbps max! (https://github.com/Vanilagy/mp4-muxer/issues/36)
  alpha = true;

  width: number;
  height: number;

  constructor(
    private image: ImageBitmap,
    private fps: number
  ) {}

  static isSupported() {
    return 'VideoEncoder' in globalThis;
  }

  async init() {
    await this.createWebMMuxer();
    let playable = await this.isPlayable();
    if (!playable) {
      // If WebM is not playable or undetermined, fall back to MP4
      await this.createMP4Muxer();
    }

    await this.createVideoEncoder();
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
      hasAlphaChannel: this.alpha,
    };

    const {supported} = await navigator.mediaCapabilities.decodingInfo({type: 'file', video: videoConfig});
    return supported;
  }

  async createWebMMuxer() {
    const {Output, WebMOutputFormat, BufferTarget, EncodedVideoPacketSource} = await import('mediabunny');

    // Set the metadata
    this.container = 'webm';
    this.codec = 'vp09.00.10.08';
    this.width = this.image.width;
    this.height = this.image.height;

    // Create the packet source
    this.packetSource = new EncodedVideoPacketSource('vp9');

    // Create the output
    this.output = new Output({
      format: new WebMOutputFormat(),
      target: new BufferTarget(),
    });

    this.output.addVideoTrack(this.packetSource, {
      frameRate: this.fps,
    });
  }

  async createMP4Muxer() {
    const {Output, Mp4OutputFormat, BufferTarget, EncodedVideoPacketSource} = await import('mediabunny');

    // Set the metadata
    this.container = 'mp4';
    this.codec = 'avc1.42001f';
    // H264 only supports even sized frames
    this.width = this.image.width + (this.image.width % 2);
    this.height = this.image.height + (this.image.height % 2);

    // Create the packet source
    this.packetSource = new EncodedVideoPacketSource('avc');

    // Create the output
    this.output = new Output({
      format: new Mp4OutputFormat({
        fastStart: 'in-memory',
      }),
      target: new BufferTarget(),
    });

    this.output.addVideoTrack(this.packetSource);
  }

  async createVideoEncoder() {
    this.videoEncoder = new VideoEncoder({
      output: (chunk: EncodedVideoChunk, meta?: EncodedVideoChunkMetadata) => {
        const packet = EncodedPacket.fromEncodedChunk(chunk);
        this.packetSource.add(packet, meta);
      },
      error: (e: Error) => console.error(e),
    });
    const config = {
      codec: this.codec,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      framerate: this.fps,
      // TODO: this is not yet supported in Chrome https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/webcodecs/video_encoder.cc#290
      // alpha: this.alpha ? 'keep' as AlphaOption : 'discard'
    };
    this.videoEncoder.configure(config);

    // Start the output
    await this.output.start();

    // Flush the frame buffer
    for (const frame of this.frameBuffer) {
      this.encodeFrame(frame);
    }
    this.frameBuffer = [];
  }

  addFrame(index: number, image: ImageBitmap) {
    const ms = 1_000_000; // 1µs
    const frame = new VideoFrame(image, {
      timestamp: (ms * index) / this.fps,
      duration: ms / this.fps,
    });
    if (this.videoEncoder) {
      this.encodeFrame(frame);
    } else {
      this.frameBuffer.push(frame);
    }
  }

  encodeFrame(frame: VideoFrame) {
    this.videoEncoder.encode(frame);
    frame.close();
  }

  async finalize() {
    await this.videoEncoder.flush();
    this.packetSource.close();
    await this.output.finalize();
    this.videoEncoder.close();
    delete this.videoEncoder;

    const buffer = (this.output.target as any).buffer as ArrayBuffer;
    return new Blob([buffer], {type: `video/${this.container}`});
  }

  close() {
    if (this.videoEncoder) {
      this.videoEncoder.close();
      delete this.videoEncoder;
    }
    if (this.packetSource) {
      this.packetSource.close();
      delete this.packetSource;
    }
    if (this.output) {
      delete this.output;
    }
  }
}
