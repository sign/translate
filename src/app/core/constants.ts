function nav(property: 'platform' | 'vendor' | 'userAgent') {
  return 'navigator' in globalThis ? navigator[property] : '';
}

export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(nav('platform'));
export const isIOS = /(iPhone|iPod|iPad)/i.test(nav('platform'));

export const isSafari =
  /apple/i.test(nav('vendor')) &&
  !/crios/i.test(nav('userAgent')) &&
  !/fxios/i.test(nav('userAgent')) &&
  !/Opera|OPT\//.test(nav('userAgent'));

export const isChrome = /(Chrome|Chromium)/i.test(nav('userAgent'));

// Safari, mobile Chrome, not including desktop Chrome
export const isWebKit = /AppleWebKit/i.test(nav('userAgent')) && (!isChrome || (isIOS && isChrome));
