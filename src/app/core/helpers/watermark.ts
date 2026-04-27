// Logo paths from logo-base.svg (viewBox: 0 0 100 33)
const LEFT_WAVE_D =
  'M13.385 3.92576V25.869C13.385 26.5503 12.7168 27.0298 12.0722 26.8084C9.04169 25.7668 1.81987 22.8516 1.81987 18.7088C1.81987 14.8384 8.10097 13.4103 8.10097 9.97758C8.09966 6.26185 0 3.47898 0 0.96864V0.948987C0.0039306 0.385601 0.466431 -0.0402142 1.02982 0.0030224C4.94994 0.309609 8.39708 1.35122 12.2989 2.48061C12.9422 2.66666 13.3863 3.25625 13.3863 3.92576H13.385Z';
const RIGHT_WAVE_D =
  'M15.2023 26.6499V4.70532C15.2023 4.02402 15.8705 3.54449 16.5151 3.76591C19.5456 4.80752 26.7674 7.72271 26.7674 11.8656C26.7674 15.7359 20.4863 17.164 20.4863 20.5967C20.4863 24.3151 28.586 27.0966 28.586 29.607V29.6266C28.582 30.19 28.1195 30.6172 27.5561 30.5726C23.636 30.266 20.1889 29.2244 16.2871 28.095C15.6438 27.909 15.1996 27.3194 15.1996 26.6499H15.2023Z';
const TEXT_R_D =
  'M41.6042 25.8453V4.72461H52.4738C56.4064 4.72461 58.8218 7.14008 58.8218 10.7486V11.0431C58.8218 13.8268 57.3784 15.7415 54.7715 16.3307C56.0823 16.7136 56.8629 17.7593 57.349 19.7182L57.9528 22.2515C58.4094 24.0779 58.9249 25.1972 59.5877 25.698V25.8453H55.4932C55.0955 25.0205 54.8451 24.0337 54.5064 22.443L54.1087 20.4988C53.6669 18.3779 52.6506 17.4795 50.7211 17.4795H45.0507V25.8453H41.6042ZM51.6049 14.9904C53.9467 14.9904 55.3754 13.5617 55.3754 11.2788V10.9842C55.3754 8.73076 53.9467 7.3021 51.6049 7.3021H45.0507V14.9904H51.6049Z';
const TEXT_Y_D =
  'M63.3653 32.0755C62.5258 32.0755 61.7304 31.9871 61.4506 31.9429V29.2623C61.7746 29.3065 62.5552 29.3654 63.0413 29.3654C64.7498 29.3654 65.5893 28.6879 66.1637 27.2887L66.7234 25.9042L60.611 10.7633H64.087L68.4613 22.4577L72.7915 10.7633H76.2085L69.1241 28.2608C68.1079 30.7941 66.6203 32.0755 63.3653 32.0755Z';
const TEXT_L_D = 'M78.3218 25.8453V4.72461H81.5473V25.8453H78.3218Z';
const TEXT_O_D =
  'M92.2178 26.3461C87.2691 26.3461 84.4559 23.5182 84.4559 18.54V18.0686C84.4559 13.0757 87.2691 10.2625 92.2178 10.2625C97.1814 10.2625 99.9945 13.0757 99.9945 18.0686V18.54C99.9945 23.5182 97.1814 26.3461 92.2178 26.3461ZM92.2326 23.96C94.9279 23.96 96.6953 22.1926 96.6953 18.6872V17.9214C96.6953 14.416 94.9279 12.6485 92.2326 12.6485C89.5225 12.6485 87.7551 14.416 87.7551 17.9214V18.6872C87.7551 22.1926 89.5225 23.96 92.2326 23.96Z';

const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 33;

const HAS_PATH2D = typeof Path2D !== 'undefined';
const leftWavePath = HAS_PATH2D ? new Path2D(LEFT_WAVE_D) : null;
const rightWavePath = HAS_PATH2D ? new Path2D(RIGHT_WAVE_D) : null;
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

const SPLIT_DISTANCE = 10;
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
  if (!leftWavePath || !rightWavePath || !textPaths) return;
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
  ctx.translate(-splitOffset, 0);
  ctx.fill(leftWavePath);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = iconAlpha * BASE_ALPHA;
  ctx.fillStyle = ICON_COLOR;
  ctx.translate(splitOffset, 0);
  ctx.fill(rightWavePath);
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
