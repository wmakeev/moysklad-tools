'use strict';

var _require = require('@wmakeev/maybes');

const maybe = _require.maybe;

const getAttr = require('./getAttr');

module.exports = function getAttrMaybe() {
  return maybe(getAttr.apply(undefined, arguments));
};