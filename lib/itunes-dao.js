/**
 * DAO layer that wraps the calls to iTunes API. 
 */
const https = require('https');
const VError = require('verror');
const log = require('../lib/logger');

const hostname = 'itunes.apple.com';

/**
 * Generates search options string to search the iTunes Store with the given filters.  
 * @param {Object} options - A json object with the search parameters.
 * @return {String} - A string with the search filters as encoded components.
 */
const generateSearchOptions = (options) => {
  if (options == null) { return ''; }
  const optionsString = Object.keys(options).map((key) => {
    const value = options[key];
    return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
  }).join('&');
  return optionsString;
};

/**
 * Builds the request data for making an API call the iTunes Store.
 * @param {Object} options - A json object with the request data 
 * @param {String} resource - Resource to be called Eg: search, lookup.
 * @param {String} httpMethod - HTTP Method
 */
const generateRequestDataForSearch = (options, resource, httpMethod) => ({
  host: hostname,
  path: `/${resource}?${generateSearchOptions(options)}`,
  method: httpMethod,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Parses the HTTP Response.
 * @param {HTTP Response} response - HTTP Response
 * @param {Function} callback - Callback
 */
const parseResponse = (response, callback) => {
  response.setEncoding('utf8');
  let result = '';
  response.on('data', (responseData) => {
    result += responseData;
  });
  response.on('end', () => {
    callback(JSON.parse(result));
  });
};

/**
 * Searches iTunes store using iTunes API.
 * @param {Object} options - Search Options 
 * 
 * raises AppError if an error occurs while making a call to iTunes Store.
 */
module.exports = function searchiTunes(options) {
  return new Promise((resolve, reject) => {
    /* eslint-disable consistent-return */
    const requestHandler = https.request(generateRequestDataForSearch(options, 'search', 'GET'), (response) => {
      if (response.statusCode !== 200) {
        const error = new VError({
          name: 'RequestError',
          cause: response.statusMessage,
          info: {
            statusCode: response.statusCode,
          },
        }, 'error occurred while retrieving data from iTunes.');
        log.error({ err: error });
        reject(error);
      } else {
        parseResponse(response, (result) => {
          log.info('Response from iTunes API: %j', result);
          resolve(result);
        });
      }
    });
    requestHandler.on('err', (err) => {
      const error = new VError({
        name: 'RequestError',
        cause: err,
        info: {
          statusCode: err.statusCode,
        },
      }, 'error occurred while making an API call to iTunes');
      log.error({ err: error });
      reject(error);
    });
    requestHandler.end();
  });
};
