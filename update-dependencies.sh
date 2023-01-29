ncu --cacheClear -u --reject filesize,typescript
npm install

ncu --cacheClear --cwd functions --reject node-fetch,typescript -u
npm install --prefix functions
