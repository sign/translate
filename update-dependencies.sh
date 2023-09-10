# Update client dependencies
rm package-lock.json
bun x npm-check-updates --cacheClear -u --reject filesize,@types/dom-webcodecs,typescript,@ngneat/transloco,@types/three
bun install
git add package-lock.json

# TODO: @ngneat/transloco needs to be updated to v5, not sure what changed
# TODO @types/three 0.156 is buggy for us

# Update server dependencies
rm functions/package-lock.json
bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch
cd functions && bun install && cd ..
git add functions/package-lock.json
