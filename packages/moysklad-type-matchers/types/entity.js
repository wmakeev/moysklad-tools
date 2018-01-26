'use strict'

const uuid = require('./uuid')
const entityRef = require('./entityRef')

module.exports = function (ent) {
  return entityRef(ent) && uuid(ent.id)
}
