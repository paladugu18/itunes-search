/**
 * Handles the routes to /searchitunes. 
 */
const express = require('express');
const iTunesRequestHandler = require('../../lib/itunes-dao');
const log = require('../../lib/logger');


const router = express.Router();

router.post('/', (req, res) => {
  log.info({ request: req });
  // Builds the options object from HTTP Request.
  const options = req.body;

  /**
   * Handles the POST calls for searching iTunes.
   * @param {Object} options  - A json object with the search options.
   * @return {HTTP Response}  - Sends the response with the retrieved data.   
   */
  iTunesRequestHandler(options)
    .then((result) => {
      const itunesContextData = {
        options,
        result,
      };
      log.info('Response from iTunesRequestHandler: %j', itunesContextData);
      res.render('itunes-results', itunesContextData);
    }).catch((error) => {
      log.error({ err: error });
      res.render('error', {
        errorMessage: 'Internal Server Error',
      });
    });
});

module.exports = router;
