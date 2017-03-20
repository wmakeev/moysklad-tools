'use strict'

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid')
})
const getAttr = require('./getAttr')

module.exports = function getAttrVal () {
  let { entity, attrId } = have.strict(arguments, [
    { entity: 'Obj', attrId: 'uuid' },
    { entity: 'Obj', meta: 'Obj' }, // TODO meta
    have.argumentsObject
  ])

  let attr = getAttr({ entity, attrId })

  if (!attr) { return void 0 }

  return attr.value
}
