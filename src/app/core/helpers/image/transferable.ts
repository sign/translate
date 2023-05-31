import * as comlink from 'comlink';

export async function transferableImageBitmap(
  image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement
): Promise<ImageBitmap> {
  const bitmap = await createImageBitmap(image);
  return comlink.transfer(bitmap, [bitmap]);
}

export async function transferableImageData(
  image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
  imageCtx?: CanvasRenderingContext2D
): Promise<ImageData> {
  let {width, height} = image;
  if (image instanceof HTMLVideoElement) {
    width = image.videoWidth;
    height = image.videoHeight;
  }

  let ctx: CanvasRenderingContext2D;
  if (imageCtx) {
    ctx = imageCtx; // Preferably, the context is using {willReadFrequently: true}
  } else if (image instanceof HTMLCanvasElement) {
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

export async function transferableImage(
  image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
  ctx?: CanvasRenderingContext2D
): Promise<ImageBitmap | ImageData> {
  if ('window' in globalThis && window.createImageBitmap && window.OffscreenCanvas) {
    return transferableImageBitmap(image);
  }

  return transferableImageData(image, ctx);
}
