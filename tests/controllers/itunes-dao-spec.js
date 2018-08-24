/* eslint no-underscore-dangle: ["error", { "allow": ["__get__"] }] */
require('tap').mochaGlobals();
const nock = require('nock');
const rewire = require('rewire');
const assert = require('assert');

const app = rewire('../../lib/itunes-dao');

describe('iTunes-dao', () => {
  const options = {
    term: 'testTerm',
    media: 'testMovie',
  };

  describe('#generateSearchOptions', () => {
    const subject = app.__get__('generateSearchOptions');

    context('when options are provided', () => {
      it('should return a string with URL style embedded options', (done) => {
        const result = subject(options);
        assert.equal(result, 'term=testTerm&media=testMovie');
        done();
      });
    });

    context('when options are empty', () => {
      it('should return an empty string', (done) => {
        const result = subject({});
        assert.equal(result, '');
        done();
      });
    });

    context('when no arguments are passed', () => {
      it('should return an empty string', (done) => {
        const result = subject();
        assert.equal(result, '');
        done();
      });
    });
  });

  describe('#generateRequestDataForSearch', () => {
    const subject = app.__get__('generateRequestDataForSearch');

    context('when options and resource are provided', () => {
      const expectedResult = {
        host: 'itunes.apple.com',
        path: '/search?term=testTerm&media=testMovie',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      it('should return a string with URL style embedded options', (done) => {
        const result = subject(options, 'search', 'GET');
        assert.deepEqual(result, expectedResult);
        done();
      });
    });
  });

  describe('#searchiTunes', () => {
    context('when the search is success and return results', () => {
      const mockResult = {
        wrapperType: 'testTrack',
        kind: 'testKind',
        trackId: 100,
        artistName: 'testArtistName',
      };

      beforeEach(() => {
        nock('https://itunes.apple.com')
          .get('/search?term=testTerm&media=testMovie')
          .reply(200, {
            resultCount: 1,
            results: mockResult,
          });
      });

      it('should return only one result', (done) => {
        app(options)
          .then((result) => {
            assert.deepEqual(result.resultCount, 1);
            done();
          });
      });

      it('should match the expected result', (done) => {
        app(options)
          .then((result) => {
            assert.deepEqual(result.results, mockResult);
            done();
          });
      });
    });

    context('when the search is not successful', () => {
      beforeEach(() => {
        nock('https://itunes.apple.com')
          .get('/search?term=testTerm&media=testMovie')
          .reply(500);
      });

      it('should return an error with an error message', (done) => {
        app(options)
          .then(() => {
            assert.fail('Expected the test to fail.');
          })
          .catch((err) => {
            assert.equal(err.message, 'error occurred while retrieving data from iTunes.');
            done();
          });
      });
    });
  });
});
