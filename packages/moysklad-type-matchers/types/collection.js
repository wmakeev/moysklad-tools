'use strict'

const meta = require('./meta')

module.exports = function (col) {
  if (col === null || col === undefined) return false
  if (col.rows instanceof Array) return true
  else if (meta(col.meta)) {
    return col.meta.hasOwnProperty('size') && typeof col.meta.size === 'number'
  } else {
    return false
  }
}
