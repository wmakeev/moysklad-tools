'use strict'

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid')
})

module.exports = function getAttr () {
  let { entity, attrId } = have.strict(arguments, [
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
