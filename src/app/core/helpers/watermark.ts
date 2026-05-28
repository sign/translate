// Logo paths from logo.svg — icon (139x152) + "Rylo" letterforms, cropped to 460x152 (the
// "Translate" portion of the source 1039x152 viewBox is omitted from the watermark)
const ICON_BOTTOM_D =
  'M135.553 125.712C141.026 120.099 139.239 115.693 129.823 119.136C112.145 125.602 78.651 124.786 64.3354 110.47C43.318 89.4525 55.5959 42.0107 31.6433 42.0107C7.6907 42.0107 -21.3084 114.03 23.2275 141.875C65.3727 168.218 127.792 133.679 135.561 125.72L135.553 125.712Z';
const ICON_TOP_D =
  'M3.07486 25.903C-2.39835 31.5159 -0.610727 35.9224 8.80553 32.4796C26.4831 26.0133 59.977 26.8299 74.2927 41.1455C95.3101 62.1629 83.0321 109.605 106.985 109.605C130.937 109.605 159.937 37.585 115.401 9.74082C73.2554 -16.5953 10.8359 17.9433 3.07486 25.903Z';
const TEXT_R_D =
  'M186.263 27.5423H235.631C241.518 27.5423 246.624 28.6795 250.95 30.9539C255.321 33.2283 258.665 36.4393 260.984 40.5867C263.303 44.6896 264.463 49.4614 264.463 54.9021V56.24C264.463 62.5726 262.857 67.835 259.646 72.027C256.48 76.1745 251.954 78.9171 246.067 80.255C249.01 81.1023 251.418 82.7747 253.291 85.2721C255.164 87.7249 256.658 91.1811 257.773 95.6407L260.516 107.147C261.542 111.339 262.657 114.728 263.861 117.314C265.109 119.856 266.47 121.685 267.941 122.8V123.469H249.345C248.497 121.685 247.739 119.656 247.07 117.381C246.446 115.062 245.71 111.941 244.863 108.016L243.057 99.1861C242.075 94.3697 240.359 90.8912 237.906 88.7506C235.453 86.5654 232.041 85.4728 227.671 85.4728H201.917V123.469H186.263V27.5423ZM231.685 74.1676C236.992 74.1676 241.161 72.6737 244.194 69.6857C247.271 66.6532 248.81 62.528 248.81 57.3103V55.9724C248.81 50.8438 247.271 46.7856 244.194 43.7976C241.161 40.7651 236.992 39.2488 231.685 39.2488H201.917V74.1676H231.685Z';
const TEXT_Y_D =
  'M285.098 151.765C281.843 151.765 278.944 151.564 276.402 151.163V138.988C277.339 139.122 278.52 139.233 279.947 139.323C281.375 139.412 282.601 139.456 283.627 139.456C287.417 139.456 290.383 138.698 292.524 137.182C294.709 135.666 296.47 133.28 297.808 130.024L300.35 123.736L272.589 54.969H288.376L308.244 108.083L327.911 54.969H343.43L311.254 134.439C309.649 138.453 307.753 141.709 305.568 144.206C303.383 146.703 300.64 148.576 297.34 149.825C294.04 151.118 289.959 151.765 285.098 151.765Z';
const TEXT_L_D = 'M353.028 27.5423H367.678V123.469H353.028V27.5423Z';
const TEXT_O_D =
  'M416.142 125.743C408.694 125.743 402.317 124.361 397.01 121.596C391.747 118.831 387.734 114.795 384.969 109.488C382.248 104.181 380.888 97.7813 380.888 90.2892V88.1485C380.888 80.6118 382.248 74.2122 384.969 68.9499C387.734 63.6429 391.747 59.607 397.01 56.842C402.317 54.0771 408.694 52.6946 416.142 52.6946C423.634 52.6946 430.011 54.0771 435.273 56.842C440.58 59.607 444.594 63.6429 447.314 68.9499C450.079 74.2122 451.462 80.6118 451.462 88.1485V90.2892C451.462 97.7813 450.079 104.181 447.314 109.488C444.594 114.795 440.58 118.831 435.273 121.596C430.011 124.361 423.634 125.743 416.142 125.743ZM416.208 114.906C422.496 114.906 427.447 112.877 431.059 108.819C434.671 104.716 436.477 98.7624 436.477 90.9581V87.4796C436.477 79.6753 434.671 73.744 431.059 69.6857C427.447 65.5829 422.496 63.5314 416.208 63.5314C409.92 63.5314 404.948 65.5829 401.291 69.6857C397.679 73.744 395.873 79.6753 395.873 87.4796V90.9581C395.873 98.7624 397.679 104.716 401.291 108.819C404.948 112.877 409.92 114.906 416.208 114.906Z';

const VIEWBOX_WIDTH = 460;
const VIEWBOX_HEIGHT = 152;

const HAS_PATH2D = typeof Path2D !== 'undefined';
const iconBottomPath = HAS_PATH2D ? new Path2D(ICON_BOTTOM_D) : null;
const iconTopPath = HAS_PATH2D ? new Path2D(ICON_TOP_D) : null;
const textPaths = HAS_PATH2D
  ? [new Path2D(TEXT_R_D), new Path2D(TEXT_Y_D), new Path2D(TEXT_L_D), new Path2D(TEXT_O_D)]
  : null;

const ICON_COLOR = '#FF8B2B';
const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = '#191412';

// Animation timing (seconds)
const ENTRANCE = 0.6;
const HOLD = 2.5;
const EXIT = 0.6;
const HIDDEN = 0.5;
const CYCLE = ENTRANCE + HOLD + EXIT + HIDDEN;

const SPLIT_DISTANCE = 40;
const BASE_ALPHA = 1;
const PADDING_RATIO = 0.08;

// Positions as [xFraction, yFraction] where 0=left/top, 0.5=center, 1=right/bottom
// Ordered to maximize travel distance between consecutive positions
const POSITIONS: Array<[number, number]> = [
  [0, 1], // bottom-left
  [1, 0.5], // middle-right
  [0, 0], // top-left
  [1, 1], // bottom-right
  [0.5, 0], // top-center
  [0, 0.5], // middle-left
  [1, 0], // top-right
  [0.5, 1], // bottom-center
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function detectTextColor(ctx: CanvasRenderingContext2D): string {
  const pixel = ctx.getImageData(0, 0, 1, 1).data;
  const luminance = (0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]) / 255;
  return luminance < 0.5 ? TEXT_LIGHT : TEXT_DARK;
}

export function drawWatermark(canvas: HTMLCanvasElement, frameIndex = 0, totalFrames = 1, fps = 25): void {
  if (!iconBottomPath || !iconTopPath || !textPaths) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const textColor = detectTextColor(ctx);
  const padding = Math.round(canvas.height * PADDING_RATIO);
  const drawHeight = Math.max(24, Math.round(canvas.height * 0.08));
  const scale = drawHeight / VIEWBOX_HEIGHT;
  const drawWidth = Math.round(VIEWBOX_WIDTH * scale);

  if (totalFrames <= 1) {
    drawLogo(ctx, padding, canvas.height - drawHeight - padding, scale, 0, 1, 1, textColor);
    return;
  }

  // Seed position order by total frame count for consistent-per-translation randomness
  const posOffset = totalFrames % POSITIONS.length;

  const currentTime = frameIndex / fps;
  const cycleIndex = Math.floor(currentTime / CYCLE);
  const cycleTime = currentTime % CYCLE;

  let splitOffset: number;
  let iconAlpha: number;
  let textAlpha: number;
  let breath = 1;

  if (cycleTime < ENTRANCE) {
    const p = cycleTime / ENTRANCE;
    const e = easeInOutCubic(p);
    splitOffset = SPLIT_DISTANCE * (1 - e);
    iconAlpha = e;
    textAlpha = p > 0.25 ? easeInOutCubic((p - 0.25) / 0.75) : 0;
  } else if (cycleTime < ENTRANCE + HOLD) {
    const p = (cycleTime - ENTRANCE) / HOLD;
    splitOffset = 0;
    iconAlpha = 1;
    textAlpha = 1;
    breath = 1 + 0.015 * Math.sin(p * Math.PI * 2);
  } else if (cycleTime < ENTRANCE + HOLD + EXIT) {
    const p = (cycleTime - ENTRANCE - HOLD) / EXIT;
    const e = easeInOutCubic(p);
    splitOffset = SPLIT_DISTANCE * e;
    iconAlpha = 1 - e;
    textAlpha = p < 0.75 ? easeInOutCubic(1 - p / 0.75) : 0;
  } else {
    return;
  }

  const [xFrac, yFrac] = POSITIONS[(posOffset + cycleIndex) % POSITIONS.length];
  const x = padding + xFrac * (canvas.width - drawWidth - padding * 2);
  const y = padding + yFrac * (canvas.height - drawHeight - padding * 2);

  drawLogo(ctx, x, y, scale, splitOffset, iconAlpha, textAlpha, textColor, breath, drawWidth, drawHeight);
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  splitOffset: number,
  iconAlpha: number,
  textAlpha: number,
  textColor: string,
  breath = 1,
  drawWidth?: number,
  drawHeight?: number
): void {
  ctx.save();
  ctx.translate(x, y);

  if (breath !== 1 && drawWidth && drawHeight) {
    ctx.translate(drawWidth / 2, drawHeight / 2);
    ctx.scale(breath, breath);
    ctx.translate(-drawWidth / 2, -drawHeight / 2);
  }

  ctx.scale(scale, scale);

  ctx.save();
  ctx.globalAlpha = iconAlpha * BASE_ALPHA;
  ctx.fillStyle = ICON_COLOR;
  ctx.translate(0, -splitOffset);
  ctx.fill(iconTopPath);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = iconAlpha * BASE_ALPHA;
  ctx.fillStyle = ICON_COLOR;
  ctx.translate(0, splitOffset);
  ctx.fill(iconBottomPath);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = textAlpha * BASE_ALPHA;
  ctx.fillStyle = textColor;
  for (const p of textPaths) {
    ctx.fill(p);
  }
  ctx.restore();

  ctx.restore();
}
