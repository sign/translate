import type * as tf from '@tensorflow/tfjs';
import {Injectable} from '@angular/core';
import {loadTFJS} from './tfjs.loader';

@Injectable({
  providedIn: 'root',
})
export class TensorflowService {
  private static importPromise: Promise<typeof tf>;
  private tf: typeof tf;

  async load(): Promise<void> {
    if (!TensorflowService.importPromise) {
      TensorflowService.importPromise = loadTFJS();
    }

    this.tf = await TensorflowService.importPromise;

    return this.tf.ready();
  }

  // TODO implement a global getter to get all properties from tf

  get setBackend(): typeof tf.setBackend {
    return this.tf.setBackend;
  }

  get softmax(): typeof tf.softmax {
    return this.tf.softmax;
  }

  get tidy(): typeof tf.tidy {
    return this.tf.tidy;
  }

  get stack(): typeof tf.stack {
    return this.tf.stack;
  }

  get loadLayersModel(): typeof tf.loadLayersModel {
    return this.tf.loadLayersModel;
  }

  get sub(): typeof tf.sub {
    return this.tf.sub;
  }

  get pow(): typeof tf.pow {
    return this.tf.pow;
  }

  get tensor2d(): typeof tf.tensor2d {
    return this.tf.tensor2d;
  }

  get scalar(): typeof tf.scalar {
    return this.tf.scalar;
  }

  get dot(): typeof tf.dot {
    return this.tf.dot;
  }

  get sqrt(): typeof tf.sqrt {
    return this.tf.sqrt;
  }

  get tensor(): typeof tf.tensor {
    return this.tf.tensor;
  }

  get browser(): typeof tf.browser {
    return this.tf.browser;
  }

  get isNaN(): typeof tf.isNaN {
    return this.tf.isNaN;
  }
}
