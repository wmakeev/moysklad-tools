'use strict'

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid')
})

module.exports = function getAttr (...args) {
  let { entity, attrId } = have.strict(args, [
    { entity: 'Obj', attrId: 'uuid' },
    { entity: 'Obj', meta: 'Obj' }, // TODO meta
    have.argumentsObject
  ])

  if (!entity.attributes) {
    // TODO Нужна ли ошибка?
    // throw new Error('Entity has no attributes')
    return null
  }

  return entity.attributes.find(a => a.id === attrId)
}
