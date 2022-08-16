import {TextToTextTranslationEndpoint} from './controller';
import {setupFirebaseTestEnvironment} from '../firebase.extend-spec';
import {Bucket} from '@google-cloud/storage';
import {setupModelFiles} from './model/model.extend-spec';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

describe('TextToTextTranslationEndpoint', () => {
  const testEnvironment = setupFirebaseTestEnvironment();
  setupModelFiles(testEnvironment); // const modelFiles =

  let bucket: Bucket;
  beforeAll(async () => {
    bucket = testEnvironment.storage.bucket('test');
  });

  let controller: TextToTextTranslationEndpoint;
  beforeEach(() => {
    controller = new TextToTextTranslationEndpoint(bucket);
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

  it('should create a model for existing model files', async () => {
    const mockReq = new MockExpressRequest({
      url: '/',
      params: {direction: 'spoken-to-signed'},
      query: {from: 'en', to: 'ru', text: 'hello'},
    });
    const mockRes = new MockExpressResponse({request: mockReq});
    await controller.request(mockReq, mockRes);

    const response = mockRes._getJSON();

    expect(response).toEqual({
      direction: 'spoken-to-signed',
      from: 'en',
      to: 'ru',
      text: 'Здравствуйте,',
    });
  });
});
