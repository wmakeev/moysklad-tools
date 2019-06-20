'use strict'

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid'),
  href: require('moysklad-type-matchers/types/href')
})

module.exports = function getAttr (...args) {
  let { entity, attrId, href } = have.strict(args, [
    { entity: 'obj', attrId: 'uuid' },
    { entity: 'obj', href: 'href' },
    have.argumentsObject
  ])

  if (!entity.attributes) return null

  if (attrId == null && href == null) {
    throw new Error('getAttr: You should specify correct attribute id or href')
  }

  return (attrId != null
    ? entity.attributes.find(a => a.id === attrId)
    : entity.attributes.find(a => a.meta != null && a.meta.href === href)) || null
}
