import {TestBed} from '@angular/core/testing';
import * as tf from '@tensorflow/tfjs';
import {ModelNotLoadedError, Pix2PixService} from './pix2pix.service';

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

    const weights = await Promise.all(model.getWeights().map(w => w.data()));
    for (const weight of weights) {
      const isNaN = Boolean(tf.isNaN(weight).any().dataSync()[0]);
      expect(isNaN).toBeFalse();
    }
  });

  it('translate when model isn\'t available should not draw', async () => {
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    canvas1.width = canvas2.width = canvas1.height = canvas2.height = 256;

    const translate = service.translate(canvas1, canvas2);
    await expectAsync(translate).toBeRejectedWith(new ModelNotLoadedError());
  });
});
