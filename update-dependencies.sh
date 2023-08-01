# Update client dependencies
rm package-lock.json
ncu --cacheClear -u --reject filesize,@types/dom-mediacapture-transform,@types/dom-webcodecs,typescript,@google/model-viewer,@angular-devkit/build-angular,@ngneat/transloco
npm install
git add package-lock.json

# TODO: @angular-devkit/build-angular 16.1.6 does not install its own dependencies for some reason. Revisit.
# TODO: @ngneat/transloco needs to be updated to v5, not sure what changed

# Update server dependencies
rm functions/package-lock.json
ncu --cacheClear --cwd functions -u --reject node-fetch
npm install --prefix functions
git add functions/package-lock.json
