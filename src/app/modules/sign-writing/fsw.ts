import type {SignWritingStateModel} from './sign-writing.state';
import type {HandStateModel} from './hands.service';

function glyphToFswKey(glyph: string): string {
  if (!glyph) return '';
  const cp = glyph.codePointAt(0);
  if (!cp) return '';
  return cp.toString(16);
}

function handToFswToken(hand: HandStateModel, canvas: HTMLCanvasElement): string {
  if (!hand || !hand.shape) return '';

  const symHex = glyphToFswKey(hand.shape);
  const symKey = `S${symHex}`;
  const centerX = Math.round(((hand.bbox.min.x + hand.bbox.max.x) / 2) * canvas.width);
  const centerY = Math.round(((hand.bbox.min.y + hand.bbox.max.y) / 2) * canvas.height);
  return `${symKey}${centerX}x${centerY}`;
}

export function generateFSWFromState(swState: SignWritingStateModel, canvas: HTMLCanvasElement): string {
  const width = canvas.width;
  const height = canvas.height;
  const header = `M${width}x${height}`;
  const tokens: string[] = [];

  if (swState.leftHand) tokens.push(handToFswToken(swState.leftHand, canvas));
  if (swState.rightHand) tokens.push(handToFswToken(swState.rightHand, canvas));
  return `${header}${tokens.join('')}`;
}
