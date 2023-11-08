# Update client dependencies
bun x npm-check-updates --cacheClear -u --reject filesize,typescript
npm install

# filesize: ngx-filesize 3 requires filesize >= 6.0.0 < 10.0.0 as a peer dependency

# TODO @playwright/test 0.140 is buggy for us until updating typescript probably

# Update server dependencies
bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch
cd functions && bun install && cd ..
