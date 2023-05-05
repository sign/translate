# Update client dependencies
rm package-lock.json
ncu --cacheClear -u --reject filesize,@types/dom-mediacapture-transform,@types/dom-webcodecs
npm install

# Update server dependencies
rm functions/package-lock.json
ncu --cacheClear --cwd functions -u --reject node-fetch
npm install --prefix functions
