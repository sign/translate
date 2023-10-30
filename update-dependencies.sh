# Update client dependencies
bun x npm-check-updates --cacheClear -u --reject filesize,@types/dom-webcodecs,typescript,@playwright/test,@tensorflow/tfjs,@tensorflow/tfjs-backend-wasm,@tensorflow/tfjs-backend-webgl,@tensorflow/tfjs-backend-webgpu,@tensorflow/tfjs-converter,@tensorflow/tfjs-core,@tensorflow/tfjs-layers
bun install

# filesize: ngx-filesize 3 requires filesize >= 6.0.0 < 10.0.0 as a peer dependency

# TODO @playwright/test 0.140 is buggy for us until updating typescript probably
# TODO @tensorflow/tfjs 4.11.0 https://github.com/tensorflow/tfjs/issues/7974
# TODO test capacitor assets after https://github.com/lovell/sharp/issues/3779

# Update server dependencies
bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch
cd functions && bun install && cd ..
