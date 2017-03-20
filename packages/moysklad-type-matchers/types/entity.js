'use strict'

const uuid = require('./uuid')

module.exports = function (ent) {
  return ent && uuid(ent.id) && ent.meta && ent.meta.type
}
