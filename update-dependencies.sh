ncu --cacheClear -u --reject filesize,typescript,@google/model-viewer
rm package-lock.json
npm install

ncu --cacheClear --cwd functions --reject node-fetch,typescript -u
rm functions/package-lock.json
npm install --prefix functions
