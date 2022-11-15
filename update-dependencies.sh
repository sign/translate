ncu -u --reject ngx-filesize
npm install

ncu --cwd functions --reject node-fetch -u
npm install --prefix functions
