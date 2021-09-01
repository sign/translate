import * as tf from '@tensorflow/tfjs';


export class TensorflowLoader {
  static tfPromise: Promise<typeof tf>;
  static tf: typeof tf;

  get tf(): typeof tf {
    return TensorflowLoader.tf;
  }

  async loadTensorflow(): Promise<typeof tf> {
    if (!TensorflowLoader.tfPromise) {
      TensorflowLoader.tfPromise = import(/* webpackChunkName: "@tensorflow/tfjs" */ '@tensorflow/tfjs')
        .then(module => TensorflowLoader.tf = module);
    }

    return TensorflowLoader.tfPromise;
  }
}
