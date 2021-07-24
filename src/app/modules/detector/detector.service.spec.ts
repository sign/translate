import {TestBed} from '@angular/core/testing';

import {DetectorService} from './detector.service';
import * as tf from '@tensorflow/tfjs';

describe('DetectorService', () => {
  let service: DetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectorService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('model weights should not contain NaN', async () => {
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
