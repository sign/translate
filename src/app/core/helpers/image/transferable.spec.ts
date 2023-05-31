import {transferableImage, transferableImageData} from './transferable';

describe('transferableImage', () => {
  let canvas: HTMLCanvasElement;
  let img: HTMLImageElement;
  // let video: HTMLVideoElement;

  beforeAll(() => {
    canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    img = document.createElement('img');
    img.src = canvas.toDataURL();
    //
    // video = document.createElement('video');
    // video.src = img.src;
  });

  it('All latest browsers should get an image bitmap', async () => {
    const bitmap = await transferableImage(canvas);
    expect(bitmap instanceof ImageBitmap).toBeTrue();
  });

  it('should create the same size objects for images, videos, and canvas', async () => {
    const canvasObj = await transferableImage(canvas);
    const imgObj = await transferableImage(img);
    // const videoObj = await transferableImage(video);

    expect(canvasObj.width).toEqual(imgObj.width);
    expect(canvasObj.height).toEqual(imgObj.height);

    // expect(canvasObj.width).toEqual(videoObj.width)
    // expect(canvasObj.height).toEqual(videoObj.height);
  });

  it('should create the same data for images and canvas', async () => {
    const canvasObj = await transferableImageData(canvas);
    const imgObj = await transferableImageData(img);

    expect(canvasObj.data).toEqual(imgObj.data);
  });

  it('should create the same data for canvas and for context', async () => {
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    const fakeCanvas = {width: canvas.width, height: canvas.height} as HTMLCanvasElement;
    const canvasObj = await transferableImageData(canvas);
    const ctxObj = await transferableImageData(fakeCanvas, ctx);

    expect(canvasObj.data).toEqual(ctxObj.data);
  });
});
