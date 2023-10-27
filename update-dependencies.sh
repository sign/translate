# Update client dependencies
bun x npm-check-updates --cacheClear -u --reject filesize,@types/dom-webcodecs,typescript,@ngneat/transloco,@playwright/test,@tensorflow/tfjs,@tensorflow/tfjs-backend-wasm,@tensorflow/tfjs-backend-webgl,@tensorflow/tfjs-backend-webgpu,@tensorflow/tfjs-converter,@tensorflow/tfjs-core,@tensorflow/tfjs-layers,mp4-muxer
bun install

# TODO: @ngneat/transloco needs to be updated to v5, not sure what changed
# TODO @playwright/test 0.140 is buggy for us until updating typescript probably
# TODO @tensorflow/tfjs 4.11.0 https://github.com/tensorflow/tfjs/issues/7974
# TODO test capacitor assets after https://github.com/lovell/sharp/issues/3779
# TODO mp4-muxer 3.0.0 https://github.com/Vanilagy/mp4-muxer/issues/19

# Update server dependencies
bun x npm-check-updates --cacheClear --cwd functions -u --reject node-fetch
cd functions && bun install && cd ..
