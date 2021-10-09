export async function transferableImage(image: HTMLCanvasElement | HTMLVideoElement): Promise<ImageBitmap | ImageData> {
  // TODO reconsider this, once I can consistently make it run fast
  // if (window.createImageBitmap) {
  //   const bitmap = await createImageBitmap(image);
  //   return comlink.transfer(bitmap, [bitmap]);
  // }

  let ctx: CanvasRenderingContext2D;
  if (image instanceof HTMLCanvasElement) {
    ctx = image.getContext('2d');
  } else {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
  }

  const data = ctx.getImageData(0, 0, image.width, image.height);
  // return comlink.transfer(data, [data.data]);
  return data;
}
