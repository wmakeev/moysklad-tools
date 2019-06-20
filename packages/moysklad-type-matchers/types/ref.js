'use strict'

const uuid = require('./uuid')

module.exports = function (ref) {
  if (!ref || !(typeof ref === 'string')) return false
  const path = ref.split(/\//).filter(p => p)
  return path.length > 2 && path[0] === 'entity' && uuid(path.pop())
}
