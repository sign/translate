export async function loadTFJS() {
  const tf = await import(/* webpackChunkName: "@tensorflow/tfjs" */ '@tensorflow/tfjs');
  await tf.ready();

  if ('navigator' in globalThis && 'gpu' in navigator) {
    await import(/* webpackChunkName: "@tensorflow/tfjs-backend-webgpu" */ '@tensorflow/tfjs-backend-webgpu');
    await tf.setBackend('webgpu');
  }

  // defaults to webgl or cpu, need to load wasm explicitly
  if (tf.getBackend() === 'cpu') {
    const {setWasmPaths} = await import(
      /* webpackChunkName: "@tensorflow/tfjs-backend-wasm" */ '@tensorflow/tfjs-backend-wasm'
    );
    setWasmPaths('assets/models/tfjs-backend-wasm/');
    await tf.setBackend('wasm');
  }

  return tf;
}
