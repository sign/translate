const STORAGE_KEY = 'rylo.translate.drawSignWriting';

export function loadSignWritingPreference(): boolean {
  if (!('window' in globalThis)) {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function saveSignWritingPreference(value: boolean): void {
  if (!('window' in globalThis)) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, String(value));
}
