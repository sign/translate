# Update client dependencies
bun x npm-check-updates --cacheClear -u --reject filesize,typescript,mermaid,@mediapipe/tasks-text
npm install

# filesize: ngx-filesize 3 requires filesize >= 6.0.0 < 10.0.0 as a peer dependency
# typescript: The Angular Compiler requires TypeScript >=5.2.0 and <5.3.0
# mermaid: mermaid 11.0.2 crashes tests

# Update docs dependencies
bun x npm-check-updates --cacheClear --cwd docs -u
cd docs && bun install && cd ..

# Update server dependencies
# express: because express-async-errors requires express < 5

bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch,eslint,express
cd functions && bun install && cd ..
