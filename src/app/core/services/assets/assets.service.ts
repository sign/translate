import {Injectable} from '@angular/core';
import {getStorage, ref, listAll, getMetadata, getDownloadURL, type FullMetadata} from 'firebase/storage';

export type AssetState = {
  name?: string;
  label?: string;
  path: string;
  exists: boolean;
  size?: number;
  progress?: number; // Download progress in percentage
  modified?: Date;
  children?: AssetState[];
};

type ProgressCallback = (receivedLength: number, totalLength: number) => void;

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  static BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/sign-mt-assets/o/';
  static BUCKET = 'gs://sign-mt-assets';

  stat(path: string): AssetState {
    if (path.endsWith('/')) {
      const files = this.getLocalStorageDirectory(path);
      if (!files) {
        return {path, exists: false, children: []};
      }
      const filesStat = files.map(f => this.stat(path + f));
      return {
        path,
        exists: filesStat.every(f => f.exists),
        size: filesStat.reduce((acc, f) => acc + f.size, 0),
        children: filesStat,
      };
    }

    const fileStatStr = localStorage.getItem(path);
    if (!fileStatStr) {
      return {path, exists: false};
    }
    const fileStat = JSON.parse(fileStatStr) as Pick<FullMetadata, 'size' | 'updated'>;

    return {
      path,
      exists: true,
      size: fileStat.size,
      modified: new Date(fileStat.updated),
    };
  }

  async deleteCache(path: string) {
    if (path.endsWith('/')) {
      const files = this.getLocalStorageDirectory(path);
      if (files) {
        await Promise.all(files.map(f => this.deleteCache(path + f)));
      }
    } else {
      await this.deleteFile(path);
    }

    localStorage.removeItem(path);
  }

  getLocalStorageDirectory(path: string) {
    const filesStr = localStorage.getItem(path);
    if (!filesStr) {
      return null;
    }
    return filesStr.split(',');
  }

  async download(path: string, progressCallback?: ProgressCallback) {
    if (path.endsWith('/')) {
      return this.getDirectory(path, progressCallback);
    }
    return this.getFileUri(path, progressCallback);
  }

  async getDirectory(path: string, progressCallback?: ProgressCallback): Promise<Map<string, string>> {
    if (!path.endsWith('/')) {
      throw new Error('Directory path must end with /');
    }
    let files = this.getLocalStorageDirectory(path);
    if (!files) {
      // Directory is not cached
      files = Array.from(await this.listDirectory(path));
      localStorage.setItem(path, files.join(','));
    }

    // Build a combined progress callback for all files
    let totalLength = 0;
    const received = new Array(files.length).fill(0);
    const progressSet = new Set<number>();
    const fileProgressCallback = (i, fileReceivedLength, fileTotalLength) => {
      if (!progressSet.has(i)) {
        progressSet.add(i);
        totalLength += fileTotalLength;
      }
      received[i] = fileReceivedLength;
      if (progressCallback) {
        const receivedLength = received.reduce((acc, r) => acc + r, 0);
        progressCallback(receivedLength, totalLength);
      }
    };

    const localFiles = await Promise.all(
      files.map((f, i) => {
        return this.getFileUri(path + f, (n, d) => fileProgressCallback(i, n, d));
      })
    );
    const map = new Map<string, string>();
    files.forEach((f, i) => map.set(f, localFiles[i]));
    return map;
  }

  async getFileUri(path: string, progressCallback?: ProgressCallback): Promise<string> {
    const download = async () => {
      return this.getRemoteFile(path, progressCallback);
    };

    const downloadDone = async () => {
      // Save metadata, so we can check for updates later
      const metadata = await this.statRemoteFile(path);
      localStorage.setItem(path, JSON.stringify({size: metadata.size, updated: metadata.updated}));
    };

    try {
      return await this.navigatorStorageFileUri(path, download, downloadDone);
    } catch (e) {}

    return this.buildRemotePath(path);
  }

  async deleteFile(path: string) {
    await this.deleteNavigatorStorageFile(path).catch(() => {});
  }

  async deleteNavigatorStorageFile(path: string) {
    const [directory, fileName] = await this.navigatorStorageDirectory(path);

    try {
      const fileHandle = await directory.getFileHandle(fileName);
      await fileHandle.remove();
    } catch (e) {}
  }

  async navigatorStorageDirectory(path: string): Promise<[any, string]> {
    let directory = await navigator.storage.getDirectory();
    const route = path.split('/');
    const fileName = route.pop();
    for (const dir of route) {
      directory = await directory.getDirectoryHandle(dir, {create: true});
    }

    return [directory, fileName];
  }

  async navigatorStorageFileUri(path: string, download: CallableFunction, downloadDone: CallableFunction) {
    const [directory, fileName] = await this.navigatorStorageDirectory(path);

    const downloadAndWrite = async () => {
      const fileHandle = await directory.getFileHandle(fileName, {create: true});

      if (!('createWritable' in fileHandle)) {
        await fileHandle.remove();
        throw new Error('Web storage not supported');
      }

      // Write file in chunks
      const wtr = await fileHandle.createWritable();
      try {
        const chunks = await download();
        for await (const chunk of chunks) {
          await wtr.write(chunk);
        }
      } finally {
        await wtr.close();
      }

      await downloadDone();
    };

    const getFile = async () => {
      // File stat does not exist
      const statStr = localStorage.getItem(path);
      if (!statStr) {
        return null;
      }
      const stat = JSON.parse(statStr);

      // File does not exist
      let fileHandle;
      try {
        fileHandle = await directory.getFileHandle(fileName);
      } catch (e) {
        console.log('File handle does not exist in navigator.storage');
        return null;
      }

      const file = await fileHandle.getFile();
      if (Number(stat.size) !== file.size) {
        // 2023-10-18: file.size in safari is always 0
        console.error('File size mismatch', stat, file);
        return null;
      }

      return file;
    };

    let file = await getFile();
    while (!file) {
      await downloadAndWrite();
      file = await getFile();
    }

    return URL.createObjectURL(file);
  }

  buildRemotePath(path: string) {
    return AssetsService.BUCKET_URL + encodeURIComponent(path);
  }

  async listDirectory(path: string): Promise<string[]> {
    const storage = getStorage(undefined, AssetsService.BUCKET);
    const listRef = ref(storage, path);
    const {items} = await listAll(listRef);
    return items.map(i => i.name);
  }

  async statRemoteFile(path: string) {
    const storage = getStorage(undefined, AssetsService.BUCKET);
    return getMetadata(ref(storage, path));
  }

  async *getRemoteFile(path: string, progressCallback?: ProgressCallback) {
    const storage = getStorage(undefined, AssetsService.BUCKET);
    const downloadUrl = await getDownloadURL(ref(storage, path));
    const response = await fetch(downloadUrl);

    const reader = response.body.getReader();

    // Step 2: get total length
    const contentLength = +response.headers.get('Content-Length');

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        break;
      }

      receivedLength += value.length;
      if (progressCallback) {
        progressCallback(receivedLength, contentLength);
      }
      yield value;
    }
  }
}
