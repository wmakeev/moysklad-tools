'use strict'

module.exports = function (col) {
  return (
    col &&
    col.meta &&
    col.meta.href &&
    col.meta.type &&
    (col.meta.hasOwnProperty('size') || col.rows instanceof Array)
  )
}
