const LOGO_SVG_PATH =
  'M235.6 69.1V455.3c0 12-11.8 20.4-23.1 16.5C159.1 453.5 32 402.2 32 329.3c0-68.1 110.6-93.3 110.6-153.7C142.6 110.2 0 61.2 0 17V16.7C.1 6.8 8.2-.7 18.1.1c69 5.4 129.7 23.7 198.4 43.6 11.3 3.3 19.1 13.7 19.1 25.4zM267.6 469.1V82.8c0-12 11.8-20.4 23.1-16.5 53.3 18.3 180.5 69.6 180.5 142.5 0 68.1-110.6 93.3-110.6 153.7 0 65.4 142.6 114.4 142.6 158.6v.3c-.1 9.9-8.2 17.4-18.1 16.6-69-5.4-129.7-23.7-198.4-43.6-11.3-3.3-19.1-13.7-19.1-25.5z';

const SVG_VIEWBOX_WIDTH = 503.141;
const SVG_VIEWBOX_HEIGHT = 564.56;
const ASPECT_RATIO = SVG_VIEWBOX_WIDTH / SVG_VIEWBOX_HEIGHT;
const LOGO_PATH = new Path2D(LOGO_SVG_PATH);

export function drawWatermark(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const drawHeight = Math.max(28, Math.round(canvas.height * 0.1));
  const drawWidth = Math.round(drawHeight * ASPECT_RATIO);
  const padding = Math.round(canvas.height * 0.04);

  ctx.save();
  ctx.translate(padding, canvas.height - drawHeight - padding);
  ctx.scale(drawWidth / SVG_VIEWBOX_WIDTH, drawHeight / SVG_VIEWBOX_HEIGHT);
  ctx.fillStyle = '#FF8B2B';
  ctx.fill(LOGO_PATH);
  ctx.restore();
}

let reusableCanvas: HTMLCanvasElement | null = null;

export async function watermarkImageBitmap(source: ImageBitmap | HTMLCanvasElement): Promise<ImageBitmap> {
  if (!reusableCanvas) {
    reusableCanvas = document.createElement('canvas');
  }
  reusableCanvas.width = source.width;
  reusableCanvas.height = source.height;

  const ctx = reusableCanvas.getContext('2d');
  ctx.drawImage(source, 0, 0);
  drawWatermark(reusableCanvas);

  return createImageBitmap(reusableCanvas);
}
