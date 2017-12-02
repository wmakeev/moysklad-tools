'use strict';

const have = require('have2');

module.exports = function createMeta() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _have$strict = have.strict(args, [{ client: 'Object', type: 'str', path: 'str or str arr' }, have.argumentsObject]);

  let client = _have$strict.client,
      type = _have$strict.type,
      path = _have$strict.path;


  return {
    href: client.buildUrl(path),
    type: type,
    mediaType: 'application/json'
  };
};