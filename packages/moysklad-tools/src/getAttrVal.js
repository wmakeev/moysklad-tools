'use strict'

const getAttr = require('./getAttr')

module.exports = function getAttrVal (...args) {
  let attr = getAttr(...args)
  return attr != null ? attr.value : attr
}
