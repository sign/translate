ncu -u --reject typescript
npm install

ncu --cwd functions --reject node-fetch,typescript -u
npm install --prefix functions
