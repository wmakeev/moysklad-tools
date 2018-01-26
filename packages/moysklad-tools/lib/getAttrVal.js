'use strict';

const getAttr = require('./getAttr');

module.exports = function getAttrVal() {
  let attr = getAttr.apply(undefined, arguments);
  return attr != null ? attr.value : attr;
};