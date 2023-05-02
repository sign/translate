# Update client dependencies
rm package-lock.json
ncu --cacheClear -u --reject filesize,typescript,@types/dom-mediacapture-transform,@types/dom-webcodecs
npm install
# TODO: Remove @types/dom-webcodecs entirely when typescript is 5.0.0

# Update server dependencies
rm functions/package-lock.json
ncu --cacheClear --cwd functions -u --reject node-fetch,typescript
npm install --prefix functions
