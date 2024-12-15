export function getUrlParams() {
  if (!('window' in globalThis)) {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}
