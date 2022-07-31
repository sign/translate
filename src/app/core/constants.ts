const platform = 'navigator' in globalThis ? navigator.platform : '';
export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(platform);
export const isIOS = /(iPhone|iPod|iPad)/i.test(platform);
