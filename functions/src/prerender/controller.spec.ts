import {prerenderOpenSearch} from './controller';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

describe('Prerender', () => {
  describe('OpenSearch', () => {
    it('should render a valid xml', async () => {
      const mockReq = new MockExpressRequest({url: '/opensearch.xml'});
      const mockRes = new MockExpressResponse({request: mockReq});

      prerenderOpenSearch(mockReq, mockRes);
      const response = mockRes._getString();

      // TODO validate that the response is valid xml
      expect(typeof response).toEqual('string');
    });
  });
});
