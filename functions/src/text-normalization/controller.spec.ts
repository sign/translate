import {TextNormalizationEndpoint} from './controller';
import {setupFirebaseTestEnvironment} from '../firebase.extend-spec';
import {defineString} from 'firebase-functions/params';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

describe('TextNormalizationEndpoint', () => {
  const testEnvironment = setupFirebaseTestEnvironment();

  let controller: TextNormalizationEndpoint;
  beforeEach(() => {
    const key = defineString('mock-key');
    controller = new TextNormalizationEndpoint(testEnvironment.database, key);
    jest.spyOn(controller, 'normalize').mockResolvedValue('mock normalized text');
  });

  it('should error missing "lang"', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {},
      query: {text: 'hello'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(new Error('Missing "lang" query parameter'));
  });

  it('should error missing "text"', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {},
      query: {lang: 'en'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});

    await expect(controller.request(mockReq, mockRes)).rejects.toThrow(new Error('Missing "text" query parameter'));
  });

  async function normalizeExample() {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {},
      query: {lang: 'en', text: 'hello'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});
    await controller.request(mockReq, mockRes);

    return mockRes._getJSON();
  }

  it('should normalize text with correct url parameters', async () => {
    const response = await normalizeExample();

    expect(response).toEqual({
      lang: 'en',
      text: 'mock normalized text',
    });
  });

  it('should cache normalization response', async () => {
    const helloMd5 = '5d41402abc4b2a76b9719d911017c592';
    const ref = testEnvironment.database.ref('/normalizations/en/' + helloMd5);
    const snapshotBefore = await ref.once('value');
    expect(snapshotBefore.exists()).toBe(false);

    const response = await normalizeExample();

    const snapshot = await ref.once('value');
    expect(snapshot.exists()).toBe(true);
    const cachedValue = snapshot.val();
    expect(cachedValue.input).toEqual('hello');
    expect(cachedValue.counter).toEqual(1);
    expect(cachedValue.timestamp).toBeLessThanOrEqual(Date.now());
    expect(cachedValue.timestamp).toBeGreaterThanOrEqual(Date.now() - 5000);
    expect(cachedValue.output).toEqual(response.text);
  });

  it('should respond with cached response if exists', async () => {
    const ref = controller.getDBRef('en', 'hello');
    await ref.set({
      input: 'hello',
      output: 'fake response',
      counter: 1,
      timestamp: Date.now(),
    });

    const response = await normalizeExample();
    expect(response.text).toEqual('fake response');

    const snapshot = await ref.once('value');
    expect(snapshot.exists()).toBe(true);
    const cachedValue = snapshot.val();
    expect(cachedValue.counter).toEqual(2);
  });
});
