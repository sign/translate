import {TextToTextTranslationModel} from './model';
import {setupFirebaseTestEnvironment} from '../../firebase.extend-spec';
import {setupModelFiles} from './model.extend-spec';

describe('TextToTextTranslationModel', () => {
  const testEnvironment = setupFirebaseTestEnvironment();
  const modelFiles = setupModelFiles(testEnvironment);

  let model: TextToTextTranslationModel;
  beforeEach(async () => {
    model = new TextToTextTranslationModel(testEnvironment.bucket, 'en', 'ru');
  });

  afterEach(async () => {
    await model.terminate();
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
