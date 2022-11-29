ncu -u --reject filesize,typescript
npm install

ncu --cwd functions --reject node-fetch,typescript -u
npm install --prefix functions
