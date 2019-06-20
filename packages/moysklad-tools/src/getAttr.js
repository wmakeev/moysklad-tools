'use strict'

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid'),
  href: require('moysklad-type-matchers/types/href'),
  ref: require('moysklad-type-matchers/types/ref')
})

module.exports = function getAttr (...args) {
  let { entity, attrId, href, ref } = have.strict(args, [
    { entity: 'obj', attrId: 'uuid' },
    { entity: 'obj', href: 'href' },
    { entity: 'obj', ref: 'ref' },
    have.argumentsObject
  ])

  if (!entity.attributes) return null

  if (attrId == null && href == null && ref == null) {
    throw new Error('getAttr: You should specify correct attribute id, href or ref')
  }

  if (attrId != null) {
    return entity.attributes.find(a => a.id === attrId) || null
  } else if (href != null) {
    return entity.attributes.find(
      a => a.meta != null && a.meta.href === href
    ) || null
  } else {
    return entity.attributes.find(
      a => a.meta != null && a.meta.href.indexOf(ref) !== -1
    ) || null
  }
}
