'use strict'

const { maybe } = require('@wmakeev/maybes')
const getAttr = require('./getAttr')

module.exports = function getAttrMaybe (...args) {
  return maybe(getAttr(...args))
}
