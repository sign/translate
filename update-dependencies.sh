# Update client dependencies
bun x npm-check-updates --cacheClear -u --reject filesize,@types/dom-webcodecs,typescript,@ngneat/transloco,@types/three,@playwright/test
bun install

# TODO: @ngneat/transloco needs to be updated to v5, not sure what changed
# TODO @types/three 0.156 is buggy for us
# TODO @playwright/test 0.140 is buggy for us until updating typescript probably

# Update server dependencies
bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch
cd functions && bun install && cd ..
