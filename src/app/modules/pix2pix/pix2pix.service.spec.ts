import {TestBed} from '@angular/core/testing';
import * as tf from '@tensorflow/tfjs';
import {Pix2PixService} from './pix2pix.service';

describe('Pix2Pix', () => {
  let service: Pix2PixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pix2PixService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  xit('model weights should not contain NaN', async () => {
    await service.loadModel();
    const model = service.sequentialModel;

    expect(model).toBeTruthy();

    for (const weight of model.getWeights()) {
      const data = await weight.data();
      const isNaN = Boolean(tf.isNaN(data).any().dataSync()[0]);
      expect(isNaN).toBeFalse();
    }
  });
});
