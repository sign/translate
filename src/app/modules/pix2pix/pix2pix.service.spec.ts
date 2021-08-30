import {TestBed} from '@angular/core/testing';
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

  // it('model weights should not contain NaN', async () => {
  //   await service.loadModel();
  //   const model = service.sequentialModel;
  //
  //   expect(model).toBeTruthy();
  //
  //   const weights = await Promise.all(model.getWeights().map(w => w.data()));
  //   for (const weight of weights) {
  //     const isNaN = Boolean(tf.isNaN(weight).any().dataSync()[0]);
  //     expect(isNaN).toBeFalse();
  //   }
  // });
  //
  // it('translate when model isn\'t available should not draw', async () => {
  //   const canvas1 = document.createElement('canvas');
  //   const canvas2 = document.createElement('canvas');
  //   canvas1.width = canvas2.width = canvas1.height = canvas2.height = 256;
  //
  //   const translate = service.translate(canvas1, canvas2);
  //   await expectAsync(translate).toBeRejectedWith(new ModelNotLoadedError());
  // });
  //
  // it('should not reload model after model is loaded', async () => {
  //   service.sequentialModel = true as any;
  //   await service.loadModel();
  //
  //   expect(service.sequentialModel).toEqual(true as any);
  // });
  //
  // it('should call model in pipeline', async () => {
  //   service.sequentialModel = {
  //     apply: createSpy('apply').and.callFake((tensor) => tensor)
  //   } as any;
  //
  //   const canvas = document.createElement('canvas');
  //   canvas.width = canvas.height = 256;
  //   const ctx = canvas.getContext('2d');
  //   ctx.fillStyle = 'white';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //
  //   await service.translate(canvas, canvas);
  //
  //   expect(service.sequentialModel.apply).toHaveBeenCalled();
  // });
});
