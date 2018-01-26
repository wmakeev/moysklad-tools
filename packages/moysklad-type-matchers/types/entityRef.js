'use strict'

const meta = require('./meta')

module.exports = function (entRef) {
  return !!(entRef && meta(entRef.meta))
}
