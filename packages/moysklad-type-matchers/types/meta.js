'use strict'

const href = require('./href')

module.exports = function (meta) {
  return !!(meta && typeof meta.type === 'string' && href(meta.href))
}
