'use strict'

const compose = require('stampit/compose')

module.exports = compose(
  require('./createAttr'),
  require('./createMeta'),
  require('./loadRows')
)
