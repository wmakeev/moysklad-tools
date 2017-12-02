'use strict'

const compose = require('@stamp/compose')

module.exports = compose(
  require('./createAttr'),
  require('./createMeta'),
  require('./loadRows')
)
