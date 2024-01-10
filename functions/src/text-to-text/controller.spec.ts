import {TextToTextTranslationEndpoint} from './controller';
import {setupFirebaseTestEnvironment} from '../firebase.extend-spec';
import {setupModelFiles} from './model/model.extend-spec';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

describe('TextToTextTranslationEndpoint', () => {
  const testEnvironment = setupFirebaseTestEnvironment();
  setupModelFiles(testEnvironment); // const modelFiles =

  let controller: TextToTextTranslationEndpoint;
  beforeEach(() => {
    controller = new TextToTextTranslationEndpoint(testEnvironment.database, testEnvironment.bucket);
  });

  it('should error invalid direction', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'abc'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(new Error('Invalid "direction" requested'));
  });

  it('should error missing "from"', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {to: 'us'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(
      new Error('Missing "from" or "to" query parameters')
    );
  });

  it('should error missing "to"', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {from: 'en'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(
      new Error('Missing "from" or "to" query parameters')
    );
  });

  it('should error missing "text"', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {from: 'en', to: 'us'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(new Error('Missing "text" query parameter'));
  });

  it('should error missing model files', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {from: 'en', to: 'us', text: 'hello'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(
      new Error('No model or fallback model files found for direction')
    );
  });

  async function translateExample() {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {from: 'en', to: 'ru', text: 'hello'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});
    await controller.request(mockReq, mockRes);

    return mockRes._getJSON();
  }

  it('should translate text for existing model files', async () => {
    const response = await translateExample();

    expect(response).toEqual({
      direction: 'spoken-to-signed',
      from: 'en',
      to: 'ru',
      text: 'Здравствуйте, здравствуйте',
    });
  });

  it('should cache translation response', async () => {
    const helloMd5 = '5d41402abc4b2a76b9719d911017c592';
    const ref = testEnvironment.database.ref('/translations/spoken-to-signed/en-ru/' + helloMd5);
    const snapshotBefore = await ref.once('value');
    expect(snapshotBefore.exists()).toBe(false);

    const response = await translateExample();

    const snapshot = await ref.once('value');
    expect(snapshot.exists()).toBe(true);
    const cachedValue = snapshot.val();
    expect(cachedValue.text).toEqual('hello');
    expect(cachedValue.counter).toEqual(1);
    expect(cachedValue.timestamp).toBeLessThanOrEqual(Date.now());
    expect(cachedValue.timestamp).toBeGreaterThanOrEqual(Date.now() - 5000);
    expect(cachedValue.translation).toEqual(response.text);
  });

  it('should respond with cached response if exists', async () => {
    const helloMd5 = '5d41402abc4b2a76b9719d911017c592';
    const ref = testEnvironment.database.ref('/translations/spoken-to-signed/en-ru/' + helloMd5);
    await ref.set({
      text: 'hello',
      counter: 1,
      timestamp: Date.now(),
      translation: 'fake translation',
    });

    const response = await translateExample();
    expect(response.text).toEqual('fake translation');

    const snapshot = await ref.once('value');
    expect(snapshot.exists()).toBe(true);
    const cachedValue = snapshot.val();
    expect(cachedValue.counter).toEqual(2);
  });
});
