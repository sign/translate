const platform = 'navigator' in globalThis ? navigator.platform : '';
export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(platform);
export const isIOS = /(iPhone|iPod|iPad)/i.test(platform);

export const isSafari =
  /apple/i.test(navigator.vendor) &&
  !/crios/i.test(navigator.userAgent) &&
  !/fxios/i.test(navigator.userAgent) &&
  !/Opera|OPT\//.test(navigator.userAgent);
