import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import write_blob from 'capacitor-blob-writer';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  static BUCKET_URL = 'https://firebasestorage.googleapis.com/v0/b/sign-mt-assets/o/';

  async getDirectory(path: string): Promise<Map<string, string>> {
    if (!path.endsWith('/')) {
      throw new Error('Directory path must end with /');
    }
    const filesStr = localStorage.getItem(path);
    let files: string[];
    if (!filesStr) {
      // Directory is not cached
      files = Array.from(await this.listDirectory(path));
      localStorage.setItem(path, files.join(','));
    } else {
      files = filesStr.split(',');
    }

    const localFiles = await Promise.all(files.map(f => this.getFileUri(path + f)));
    const map = new Map<string, string>();
    files.forEach((f, i) => map.set(f, localFiles[i]));
    return map;
  }

  async getFileUri(path: string) {
    const download = async (asBlob = false) => {
      // Save metadata, so we can check for updates later
      const metadata = await this.statRemoteFile(path);
      localStorage.setItem(path, JSON.stringify(metadata));
      if (asBlob) {
        return this.getRemoteFileAsBlob(path);
      }
      return this.getRemoteFile(path);
    };

    try {
      return await this.navigatorStorageFileUri(path, download);
    } catch (e) {
      console.log('Navigator storage api not supported', e);
    }

    try {
      return await this.capacitorGetFileUri(path, download);
    } catch (e) {
      console.log('Capacitor file API not supported', e);
    }

    return this.buildRemotePath(path);
  }

  async navigatorStorageFileUri(path: string, download: CallableFunction) {
    let directory = await navigator.storage.getDirectory();
    const route = path.split('/');
    const fileName = route.pop();
    for (const dir of route) {
      directory = await directory.getDirectoryHandle(dir, {create: true});
    }

    let fileHandle;
    try {
      fileHandle = await directory.getFileHandle(fileName);
    } catch (e) {
      // File does not exist
      fileHandle = await directory.getFileHandle(fileName, {create: true});
      if (!('createWritable' in fileHandle)) {
        await fileHandle.remove();
        throw new Error('Web storage not supported');
      }

      // Write file in chunks
      const wtr = await fileHandle.createWritable();
      try {
        const chunks = await download();
        for await (const [chunk, progress] of chunks) {
          // console.log('Progress', Math.floor(progress * 100) + '%');
          await wtr.write(chunk);
        }
      } finally {
        await wtr.close();
      }
    }

    const file = await fileHandle.getFile();
    if (file.size === 0) {
      // In case of corrupt file
      await fileHandle.remove();
      return this.navigatorStorageFileUri(path, download);
    }
    return URL.createObjectURL(file);
  }

  async capacitorGetFileUri(path: string, download: CallableFunction) {
    const {Directory, Filesystem} = await import('@capacitor/filesystem');

    const fileOptions = {directory: Directory.External, path};
    try {
      const stat = await Filesystem.stat(fileOptions);
      if (stat.size === 0) {
        // In case of corrupt file
        await Filesystem.deleteFile(fileOptions);
        return this.capacitorGetFileUri(path, download);
      }
    } catch (e) {
      // File does not exist
      const blob = await download(true);
      await write_blob({
        path,
        directory: Directory.External,
        blob,
        fast_mode: true,
        recursive: true,
      });
    }

    if (Capacitor.getPlatform() !== 'web') {
      const {uri} = await Filesystem.getUri(fileOptions);
      return Capacitor.convertFileSrc(uri);
    }

    // For the web, we have to create an object URL
    const {data} = await Filesystem.readFile(fileOptions);
    return URL.createObjectURL(data as any as Blob);
  }

  buildRemotePath(path: string) {
    return AssetsService.BUCKET_URL + encodeURIComponent(path);
  }

  async listDirectory(path: string): Promise<string[]> {
    const request = await fetch(AssetsService.BUCKET_URL);
    const bucketContent: {items: {name: string}[]} = await request.json();
    const files = [];
    for (const file of bucketContent.items) {
      if (file.name.startsWith(path)) {
        files.push(file.name.slice(path.length));
      }
    }
    return files;
  }

  async statRemoteFile(path: string) {
    const request = await fetch(this.buildRemotePath(path));
    return request.json();
  }

  async getRemoteFileAsBlob(path: string) {
    const response = await fetch(`${this.buildRemotePath(path)}?alt=media`);
    return response.blob();
  }

  async *getRemoteFile(path: string) {
    const response = await fetch(`${this.buildRemotePath(path)}?alt=media`);

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
      yield [value, receivedLength / contentLength];
    }
  }

  // async clearCache() {
  //   const directory = await navigator.storage.getDirectory();
  // }
}
