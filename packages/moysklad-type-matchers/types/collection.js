'use strict'

module.exports = function (col) {
  return col && col.meta && col.meta.href && col.meta.size
}
