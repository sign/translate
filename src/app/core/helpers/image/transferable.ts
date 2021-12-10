import * as comlink from 'comlink';

export async function transferableImage(image: HTMLCanvasElement | HTMLVideoElement): Promise<ImageBitmap | ImageData> {
  if (window.createImageBitmap) {
    const bitmap = await createImageBitmap(image);
    return comlink.transfer(bitmap, [bitmap]);
  }

  let {width, height} = image;
  if (image instanceof HTMLVideoElement) {
    width = image.videoWidth;
    height = image.videoHeight;
  }

  let ctx: CanvasRenderingContext2D;
  if (image instanceof HTMLCanvasElement) {
    ctx = image.getContext('2d');
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
  }

  const data = ctx.getImageData(0, 0, width, height);
  return comlink.transfer(data, [data.data.buffer]);
}
