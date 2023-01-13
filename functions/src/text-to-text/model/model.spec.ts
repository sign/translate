import {TextToTextTranslationModel} from './model';
import {setupFirebaseTestEnvironment} from '../../firebase.extend-spec';
import {setupModelFiles} from './model.extend-spec';

describe('TextToTextTranslationModel', () => {
  const testEnvironment = setupFirebaseTestEnvironment(false);
  const modelFiles = setupModelFiles(testEnvironment);

  let model: TextToTextTranslationModel;
  beforeEach(() => {
    model = new TextToTextTranslationModel(testEnvironment.bucket, 'en', 'ru');
  });

  afterEach(async () => {
    // Can be that the model was not created successfully
    if (model) {
      await model.terminate();
    }
  });

  it('should initialize worker', async () => {
    await model.init(modelFiles);
  });

  it('should translate sentence', async () => {
    await model.init(modelFiles);
    const translation = await model.translate('hello!');
    expect(translation).toEqual('Здравствуйте!');
  });
});
