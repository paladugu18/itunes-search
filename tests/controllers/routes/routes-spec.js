require('tap').mochaGlobals();
const assert = require('assert');
const request = require('supertest');
const app = require('../../../index');

describe('Application Routes', () => {
  describe('GET /unhandled_route', () => {
    it('respond with 404', (done) => {
      request(app)
        .get('/test')
        .set('Accept', 'application/json')
        .field('term', 'test')
        .expect(404, (err, res) => {
          assert.equal(res.text, 'Uh oh!(404 Error)');
          done();
        });
    });
  });

  describe('GET /', () => {
    it('returns 200 status code', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });

  describe('POST /searchitunes', () => {
    it('respond with json', (done) => {
      const options = {
        term: 'field of dreams',
        limit: 50,
      };
      request(app)
        .post('/searchitunes')
        .send(options)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
});
